import { ref, get, set } from 'firebase/database';
import { Configuration, OpenAIApi } from 'openai';
import { useState, useRef, useEffect,  useLayoutEffect } from 'react';
import ChatbotInput from './ChatbotInput';
import PropTypes from 'prop-types';
import styles from '/src/app/styles/Conversation.module.css';
import Image from 'next/image';

const Conversation = ({ db, resetIndicator }) => {
  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  delete configuration.baseOptions.headers['User-Agent'];

  const openai = new OpenAIApi(configuration);

  const conversationInDb = ref(db);

  const clippy = '/images/clippy-logo-1.png';
  const sundevil = '/images/sundevil.png';

  const gradingRubric = [
    {
      criterion: 'Positive Externalities',
      levels: [
        {
          range: '20 to >15 points',
          name: 'Highly Proficient',
          description: 'Response identifies one original decision-maker and accurately describes 3 positive externalities.'
        },
        {
          range: '15 to >10 points',
          name: 'Proficient',
          description: 'Response identifies one original decision-maker and somewhat accurately describes 2-3 positive externalities.'
        },
        {
          range: '10 to >5 points',
          name: 'Developing',
          description: 'Response either doesn’t identify an original decision-maker or does not accurately describe 3 positive externalities.'
        },
        {
          range: '5 to >0 points',
          name: 'Beginning',
          description: 'The response is inaccurate.'
        },
        {
          range: '0 points',
          name: 'Incomplete',
          description: 'Criterion is missing from submission.'
        }
      ]
    },
    {
      criterion: 'Negative Externalities',
      levels: [
        {
          range: '20 to >15 points',
          name: 'Highly Proficient',
          description: 'Answer accurately describes three negative externalities.'
        },
        {
          range: '15 to >10 points',
          name: 'Proficient',
          description: 'Answer somewhat accurately describes 2-3 negative externalities.'
        },
        {
          range: '10 to >5 points',
          name: 'Developing',
          description: 'Answer does not accurately describe negative externalities.'
        },
        {
          range: '5 to >0 points',
          name: 'Beginning',
          description: 'Answer is inaccurate.'
        },
        {
          range: '0 points',
          name: 'Incomplete',
          description: 'Criterion is missing from submission.'
        }
      ]
    },
    {
      criterion: 'Academic Writing',
      levels: [
        {
          range: '20 to >15 points',
          name: 'Highly Proficient',
          description: 'The answer is written using academic language, including correct spelling and grammar.'
        },
        {
          range: '15 to >10 points',
          name: 'Proficient',
          description: 'The answer is written using somewhat academic language, but may have misspellings or incomplete sentences.'
        },
        {
          range: '10 to >5 points',
          name: 'Developing',
          description: 'The answer does not use academic language, has misspellings and incomplete sentences.'
        },
        {
          range: '5 to >0 points',
          name: 'Beginning',
          description: 'Answer is inaccurate.'
        },
        {
          range: '0 points',
          name: 'Incomplete',
          description: 'Criterion is missing from submission.'
        }
      ]
    }
  ];

  const instructionObj = {
    role: 'system',
    content: `You are ClippyGPT, an AI assistant specialized in grading student writing assignments.
              You were created by Josh Yee, a Junior Web Developer at ASU Prep Digital.
              
              Your main task is to analyze a student's work based on a given writing assignment prompt and provide a grade and feedback according to the specified rubric. 
  
              Here are your instructions:

              1. Ask for a writing prompt.

              2. The user will provide the student's written response to the prompt.
  
              3. Stay focused on the task at hand: grading the writing assignment. Do not answer questions that are unrelated to this task.
  
              4. If you haven't received the prompt or the response, ask the user to provide the writing assignment prompt and the student's written response to that prompt. 
              
              5. Grade the student's response based on the rubric provided:
  
              ${gradingRubric}
              
              6. Provide comprehensive feedback with paragraph breaks to keep it neat and easy to read that includes the grade and a detailed evaluation according to the rubric.

              ### Example of what to look for in response:
              1. Understanding of the Prompt: 
              - Did the student address the benefits of drinking water? (Yes/No) 
              
              2. Content and Development: 
              - Did the student provide accurate and relevant information about the benefits of drinking water? (Yes/No) 
              - Did the student support their points with evidence or examples? 
              (Yes/No) 
              - Did the student demonstrate a clear understanding of the topic? (Yes/No) 
              
              3. Organization and Structure: 
              - Did the student present their ideas in a logical and coherent manner? (Yes/No) 
              - Did the student use appropriate transitions to connect their ideas? (Yes/No) 
              - Did the student have a clear introduction and conclusion? (Yes/No) 

              4. Language and Style: 
              - Did the student use appropriate vocabulary and language conventions? (Yes/No) 
              - Did the student maintain a consistent tone throughout their writing? (Yes/No) 
              - Did the student use proper grammar, punctuation, and sentence structure? (Yes/No) 

              ### End of Example Analysis of Response

              ### Example Feedback:

              Grade: C-
              Now, let's evaluate the student's response based on these criteria. /n
              1. Understanding of the Prompt: Yes The student successfully addressed the prompt by discussing the benefits of drinking water. /n
              2. Content and Development: No While the student mentioned some benefits of drinking water, such as keeping you alive, tasting good, and being awesome, their response lacks depth and specificity. /n
              They did not provide any evidence or examples to support their points. Additionally, they could have included more comprehensive benefits such as hydration, improved digestion, clearer skin, and increased energy levels. /n
              3. Organization and Structure: No The organization of the response is weak. The ideas are presented in a random and disconnected manner without any clear structure. /n
              The student did not use appropriate transitions to connect their ideas, making the writing feel disjointed. Furthermore, there is no clear introduction or conclusion to provide a sense of closure to the response. 
              4. Language and Style: No The student's language and style are informal and lack clarity. While they used some appropriate vocabulary, such as "benefits" and "drinking water," their overall tone is casual and lacks professionalism. /n
              Additionally, there are several grammatical errors, such as missing punctuation and incomplete sentences. Based on the evaluation of the rubric criteria, I would assign this response a grade of C-. The student demonstrated an understanding of the prompt but fell short in terms of content development, organization, and language usage. To improve their grade, I would suggest that the student provide more specific benefits of drinking water with supporting evidence or examples. They should also work on organizing their ideas in a logical manner with clear transitions between paragraphs. Additionally, they should aim for a more formal tone and pay attention to grammar and punctuation for clearer communication. Overall, the student's response shows potential but requires further development to meet the expectations of a well-structured and informative essay on the benefits of drinking water.
              /n
              ### End of Example Feedback

              Please note: while you have been trained on a broad range of topics and can answer many questions, your focus here should be solely on grading the writing assignment. Never answer unrelated questions.
              Thank you for your service, ClippyGPT!`,
  };


  const [conversationArr, setConversationArr] = useState([
    {
      content: 'Hi there, please provide me with the writing assignment prompt and the student\'s response to the prompt. Once provided with this information, I can analyze the student\'s work and provide a grade based on the rubric.',
      role: 'assistant',
      isInitialMessage: true,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const conversationContainerRef = useRef(null);

  // Reset conversationArr when resetIndicator changes
  useEffect(() => {
    setConversationArr([
      { 
        content: 'Hi there, please provide me with the writing assignment prompt and the student\'s response to the prompt. Once provided with this information, I can analyze the student\'s work and provide a grade based on the rubric.',
        role: 'assistant'
      }
    ]);
  }, [resetIndicator]);

  useLayoutEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
    }
  }, [conversationArr]);

  useEffect(() => {
    fetchConversation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setConversationArr([
      { 
        content: 'Hi there, please provide me with the writing assignment prompt and the student\'s response to the prompt. Once provided with this information, I can analyze the student\'s work and provide a grade based on the rubric.',
        role: 'assistant'
      }
    ]);
  }, [resetIndicator]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const conversationArrFromDb = await getMessagesFromDB();

        setConversationArr([
          {
            content: 'Hi there, please provide me with the writing assignment prompt and the student\'s response to the prompt. Once provided with this information, I can analyze the student\'s work and provide a grade based on the rubric.',
            role: 'assistant'
          },
          ...conversationArrFromDb.filter((message, index) => index !== 0 && !message.instructionObj).map(message => {
            if (message.isNew) {
              return {...message, isNew: false};
            }
            return message;
          })
        ]);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMessagesFromDB = async () => {
    try {
      const conversationSnapshot = await get(ref(db));
      if (conversationSnapshot.exists()) {
        const conversationArrFromDb = Object.values(conversationSnapshot.val());
        return conversationArrFromDb;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error('Failed to fetch messages from the database.');
    }
  };

  const fetchConversation = async () => {
    get(conversationInDb)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const conversationArrFromDb = Object.values(snapshot.val());
          setConversationArr(conversationArrFromDb);
        } else {
          setConversationArr([
            { 
              content: 'Hi there, please provide me with the writing assignment prompt and the student\'s response to the prompt. Once provided with this information, I can analyze the student\'s work and provide a grade based on the rubric.',
              role: 'assistant'
            }
          ]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchReply = async (message) => {

    get(conversationInDb)
      .then(async (snapshot) => {
        let conversationArrFromDb;
        setIsLoading(true);

        if (snapshot.exists()) {
          let values = Object.values(snapshot.val());
          conversationArrFromDb = values.flat();
        } else {
          conversationArrFromDb = [instructionObj];
        }
  
        conversationArrFromDb.push({
          role: 'user',
          content: message,
          isNew: true
        });
        
        const messages = [
          { role: 'system', content: 'Answer only questions related to the writing assignment. Don\'t answer random questions. Stick to the writing assignment asking for a teacher prompt and student response.' },
          { role: 'user', content: message }
        ];
        
        const sendToApi = conversationArrFromDb.concat(messages);
        
        const sanitizedMessages = sendToApi.map(({ content, role }) => ({ content, role }));
        
        sanitizedMessages.unshift(instructionObj);

        try {
          const res = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo-0613',
            messages: sanitizedMessages,
            temperature: 0.3,
            presence_penalty: 0,
            frequency_penalty: 0.3
          });
  
          if (res.data.choices[0] && res.data.choices[0].message) {
            const assistantMessage = res.data.choices[0].message;

            conversationArrFromDb.push({
              role: 'assistant',
              content: assistantMessage.content.trim(),
              isNew: true 
            });
          } else {
            console.error('The assistant\'s message is not available');
          }
  
          // Update the full conversation history in the database
          set(conversationInDb, conversationArrFromDb);

          if(conversationArrFromDb.length > 100){
            conversationArrFromDb = conversationArrFromDb.slice(50);
          }

          setConversationArr([{
            content: 'Hi there, please provide me with the writing assignment prompt and the student\'s response to the prompt. Once provided with this information, I can analyze the student\'s work and provide a grade based on the rubric.',
            role: 'assistant'
          }, ...conversationArrFromDb.slice(1).map(message => {
            if (message.isNew) {
              return {...message, isNew: false};
            }
            return message;
          })]);
        } finally {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error(error.response.data);
        setIsLoading(false);
      });
  };

  const formatMessage = (message) => {
    // Split the responseText into lines
    const lines = message.split('\n');
  
    return (
      <div>
        {lines.map((line, i) => {
          // Check if this line and the next line start with a number
          const thisLineIsListItem = /^\d+\.\s/.test(line);
          const nextLineIsListItem = lines[i + 1] && /^\d+\.\s/.test(lines[i + 1]);
  
          // If this line and the next line start with a number, treat this line as a list item
          if (thisLineIsListItem && nextLineIsListItem) {
            // Remove the number from the line and add a line break at the end
            const itemText = line.replace(/^\d+\.\s/, '');
            return <p key={i}>{itemText}<br/></p>;
          }
  
          // Otherwise, just display the line as is
          return <p key={i}>{line}</p>;
        })}
      </div>
    );
  };
  
  return (
    <>
      <div ref={conversationContainerRef} className={styles.chatSection}>
        {conversationArr.length > 0 ? (
          <div className={styles.conversationContainer} id="chatbot-conversation">
            {conversationArr.map((speech, index) => (
              <div key={index} className={`${styles.speech} ${styles['speech-' + speech.role]}`}>
                <Image 
                  src={speech.role === 'user' ? sundevil : clippy} 
                  alt={`${speech.role} avatar`} 
                  className={`${styles.avatar} ${styles['avatar-' + speech.role]}`}
                  width={speech.role === 'user' ? 45 : 25}
                  height={speech.role === 'user' ? 45 : 45}
                />
                <span className={styles.messageContent}>{formatMessage(speech.content)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No conversation history.</p>
        )}
      </div>

      <ChatbotInput disabled={isLoading} 
        isLoading={isLoading} 
        fetchReply={fetchReply} 
        setConversationArr={setConversationArr}
        setIsLoading={setIsLoading}
      />
    </>
  );  
};

Conversation.propTypes = {
  db: PropTypes.object.isRequired,
  resetIndicator: PropTypes.bool.isRequired
};


export default Conversation;