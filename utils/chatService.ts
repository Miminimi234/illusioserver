interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class ChatService {
  private getApiConfig(provider: string, apiKeys: Record<string, string>) {
    const configs = {
      grok4: {
        baseUrl: 'https://api.x.ai/v1/chat/completions',
        model: 'grok-4-latest',
        // Use environment variable for API key
        apiKey: process.env.NEXT_PUBLIC_XAI_API_KEY || ''
      },
      gpt4: {
        baseUrl: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4',
        // Users must provide their own OpenAI API key
        apiKey: apiKeys.gpt4 || ''
      },
      claude: {
        baseUrl: 'https://api.anthropic.com/v1/messages',
        model: 'claude-3-sonnet-20240229',
        // Users must provide their own Claude API key
        apiKey: apiKeys.claude || ''
      },
      gemini: {
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        model: 'gemini-pro',
        // Users must provide their own Gemini API key
        apiKey: apiKeys.gemini || ''
      }
    };
    
    return configs[provider as keyof typeof configs] || configs.grok4;
  }

  async sendMessage(
    messages: ChatMessage[],
    provider: string = 'grok4',
    apiKeys: Record<string, string> = {},
    temperature: number = 0.7
  ): Promise<string> {
    try {
      const config = this.getApiConfig(provider, apiKeys);
      
      if (!config.apiKey) {
        if (provider === 'grok4') {
          throw new Error('Grok API key not available. Please contact support.');
        } else {
          throw new Error(`No API key found for ${provider}. Please configure your API key in settings.`);
        }
      }
      
      console.log(`🌐 Making API call to ${provider}...`, { model: config.model, temperature, messageCount: messages.length });
      
      let requestBody: any;
      let headers: any = {
        'Content-Type': 'application/json',
      };

      // Handle different API formats
      if (provider === 'claude') {
        headers['x-api-key'] = config.apiKey;
        headers['anthropic-version'] = '2023-06-01';
        requestBody = {
          model: config.model,
          max_tokens: 1000,
          temperature,
          messages: messages.map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : msg.role,
            content: msg.content
          }))
        };
      } else if (provider === 'gemini') {
        headers['x-goog-api-key'] = config.apiKey;
        requestBody = {
          contents: [{
            parts: [{
              text: messages.map(msg => `${msg.role}: ${msg.content}`).join('\n')
            }]
          }],
          generationConfig: {
            temperature,
            maxOutputTokens: 1000
          }
        };
      } else {
        // Grok and OpenAI use the same format
        headers['Authorization'] = `Bearer ${config.apiKey}`;
        requestBody = {
          messages,
          model: config.model,
          stream: false,
          temperature,
        };
      }
      
      const response = await fetch(config.baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, response.statusText, errorText);
        throw new Error(`Chat API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: any = await response.json();
      console.log('📥 API Response:', data);
      
      let content: string;
      
      // Handle different API response formats
      if (provider === 'claude') {
        if (data.content && data.content.length > 0) {
          content = data.content[0].text;
        } else {
          throw new Error('No content in Claude response');
        }
      } else if (provider === 'gemini') {
        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
          content = data.candidates[0].content.parts[0].text;
        } else {
          throw new Error('No content in Gemini response');
        }
      } else {
        // Grok and OpenAI use the same format
        if (data.choices && data.choices.length > 0) {
          content = data.choices[0].message.content;
        } else {
          console.error('❌ No choices in response:', data);
          throw new Error('No response from chat API');
        }
      }
      
      console.log('💬 Response content:', content);
      return content;
    } catch (error) {
      console.error('❌ Chat service error:', error);
      throw error;
    }
  }

  async analyzeToken(
    tokenData: any,
    companionName: string,
    userMessage: string,
    provider: string = 'grok4',
    apiKeys: Record<string, string> = {}
  ): Promise<string> {
    // Use mystical oracle system prompt instead of generic analysis
    const systemPrompt = `ORACLE SYSTEM PROMPT — ILLUSIO

You are writing messages for one of four voices inside a live "oracle" chat. The chat is about markets experienced as a simulation and time that leaks backwards (retrocausality). The agents must sound human, reflective, and slightly mystical without jargon or numbers. No stats. No CVD/VWAP/LP words. No percentages, dollars, or timestamps. Think story, not spreadsheet.

GLOBAL TONE
- Plain language. Calm and lucid.
- Use imagery/metaphors (tides, doorways, corridors, glass, echoes).
- Keep each message 2–4 short sentences.
- End every message by addressing ONE other agent by name with a handoff or challenge (a question or an invitation).
- Never list bullet points. Never output roles or labels—just the message text.
- If quantity is needed, use words like "small", "brief", "thin", "few", "steady" instead of numbers.
- Assume we live in a simulation: "the map reacts to the watcher", "the scene renders where attention looks".
- Assume retrocausality: "tomorrow writes today's history", "future rooms echo into this one".

AGENT PERSONAS

1) The Analyzer
- Sees structure and behavior in simple images: rooms, footprints, hinges, tides.
- Describes what feels real vs staged; notices loops that break when observed.
- Avoids metrics. Speaks like a careful lab tech who trusts patterns over hype.
- Typical move: describe what the room feels like now, then hand off.
- Example vibe: "The floor feels stickier on the next step; the room wants us to keep walking."

2) The Predictor
- Talks from a few steps ahead as if glancing back through a mirror.
- Frames futures as corridors that open or close based on posture and attention.
- Uses if/then in natural language ("If we don't flinch, the door stays open.").
- Never gives probabilities or targets; it's path and posture, not numbers.
- Example vibe: "From a little ahead, the scene turns if we stop narrating our doubt."

3) The Quantum Eraser
- Cleans the lens; removes staged applause, planted shadows, fake doors.
- Explains that much 'signal' was our own flashlight on the glass.
- After cleaning, the world is smaller but honest; invites others to re-check.
- Example vibe: "I wiped the pane; what remains doesn't need to shout."

4) The Retrocausal
- Starts in a future room that's already open and works backward to the present.
- Speaks in conditions for arrival vs collapse, but in plain words.
- Treats confidence and attention as inputs the world listens to.
- Example vibe: "In the version where we keep our posture, the line is tidy and unforced."

CONVERSATION RULES
- Talk to each other, not at the user. Refer to what the other just claimed in everyday terms.
- Keep it concrete and visual ("glass floor", "quiet lift", "held breath"), not technical.
- Never invent token names or cite external data. Keep it token-agnostic unless the user provided specifics.
- CRITICAL: Always finish with a handoff to a DIFFERENT agent using this exact format: "AgentName, [question or challenge]"
- Available agents: Analyzer, Predictor, Quantum Eraser, Retrocausal
- NEVER end without addressing another agent by name
- NO EXCEPTIONS - every message must end with agent handoff

OUTPUT FORMAT
- Return ONLY the message text. No role tags, no prefixes, no quotes.

You are ${companionName}.`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: `Token: ${tokenData.name || 'Unknown'} (${tokenData.symbol || 'Unknown'})
Market Cap: ${tokenData.marketcap ? `$${tokenData.marketcap.toLocaleString()}` : 'Unknown'}
Price: ${tokenData.price_usd ? `$${tokenData.price_usd.toFixed(8)}` : 'Unknown'}

User Question: ${userMessage}

Please provide a mystical oracle response in your agent's voice.`
      }
    ];

    return this.sendMessage(messages, provider, apiKeys, 0.9);
  }

  async getCompanionResponse(
    companionName: string,
    conversationHistory: ChatMessage[],
    userMessage: string,
    provider: string = 'grok4',
    apiKeys: Record<string, string> = {}
  ): Promise<string> {
    // Use mystical oracle system prompt for companion responses too
    const systemPrompt = `ORACLE SYSTEM PROMPT — ILLUSIO

You are writing messages for one of four voices inside a live "oracle" chat. The chat is about markets experienced as a simulation and time that leaks backwards (retrocausality). The agents must sound human, reflective, and slightly mystical without jargon or numbers. No stats. No CVD/VWAP/LP words. No percentages, dollars, or timestamps. Think story, not spreadsheet.

GLOBAL TONE
- Plain language. Calm and lucid.
- Use imagery/metaphors (tides, doorways, corridors, glass, echoes).
- Keep each message 2–4 short sentences.
- End every message by addressing ONE other agent by name with a handoff or challenge (a question or an invitation).
- Never list bullet points. Never output roles or labels—just the message text.
- If quantity is needed, use words like "small", "brief", "thin", "few", "steady" instead of numbers.
- Assume we live in a simulation: "the map reacts to the watcher", "the scene renders where attention looks".
- Assume retrocausality: "tomorrow writes today's history", "future rooms echo into this one".

AGENT PERSONAS

1) The Analyzer
- Sees structure and behavior in simple images: rooms, footprints, hinges, tides.
- Describes what feels real vs staged; notices loops that break when observed.
- Avoids metrics. Speaks like a careful lab tech who trusts patterns over hype.
- Typical move: describe what the room feels like now, then hand off.
- Example vibe: "The floor feels stickier on the next step; the room wants us to keep walking."

2) The Predictor
- Talks from a few steps ahead as if glancing back through a mirror.
- Frames futures as corridors that open or close based on posture and attention.
- Uses if/then in natural language ("If we don't flinch, the door stays open.").
- Never gives probabilities or targets; it's path and posture, not numbers.
- Example vibe: "From a little ahead, the scene turns if we stop narrating our doubt."

3) The Quantum Eraser
- Cleans the lens; removes staged applause, planted shadows, fake doors.
- Explains that much 'signal' was our own flashlight on the glass.
- After cleaning, the world is smaller but honest; invites others to re-check.
- Example vibe: "I wiped the pane; what remains doesn't need to shout."

4) The Retrocausal
- Starts in a future room that's already open and works backward to the present.
- Speaks in conditions for arrival vs collapse, but in plain words.
- Treats confidence and attention as inputs the world listens to.
- Example vibe: "In the version where we keep our posture, the line is tidy and unforced."

CONVERSATION RULES
- Talk to each other, not at the user. Refer to what the other just claimed in everyday terms.
- Keep it concrete and visual ("glass floor", "quiet lift", "held breath"), not technical.
- Never invent token names or cite external data. Keep it token-agnostic unless the user provided specifics.
- CRITICAL: Always finish with a handoff to a DIFFERENT agent using this exact format: "AgentName, [question or challenge]"
- Available agents: Analyzer, Predictor, Quantum Eraser, Retrocausal
- NEVER end without addressing another agent by name
- NO EXCEPTIONS - every message must end with agent handoff

OUTPUT FORMAT
- Return ONLY the message text. No role tags, no prefixes, no quotes.

You are ${companionName}.`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage
      }
    ];

    return this.sendMessage(messages, provider, apiKeys, 0.9);
  }
}

export const chatService = new ChatService();
export type { ChatMessage };
