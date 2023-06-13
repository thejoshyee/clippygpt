import { ref, get, set } from 'firebase/database';
import styled, { keyframes } from 'styled-components';
import { Configuration, OpenAIApi } from 'openai';
import { useState, useRef, useEffect } from 'react';
import ChatbotInput from './ChatbotInput';
import LoadingIcon from './LoadingIcon';
import PropTypes from 'prop-types';
import clippy from 'public/images/clippy-logo-1.png';
import sundevil from 'public/images/sundevil.png';
import Image from 'next/image';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
`;

export const ConversationContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;

  .avatar-assistant {
    width: 25px;
    height: 45px;
    margin-right: 15px;  
  }

  .avatar-user {
    width: 45px;
    height: 45px;
    margin-right: 5px;
  }

  .speech {
    padding: 1em;
    margin: 1em auto;
    max-width: 260px; 
    color: var(--light-text);
    min-width: 100%;
    border-radius: var(--border-rad-lg); 
    display: flex;
    align-items: flex-start;
  }

  .speech:first-child {
    margin-top: 0;
  }

  .speech-assistant {
    background: #5787A8;
    border-top-left-radius: 0; 
    color: #fff;
    padding: 1.5em;
    animation: ${slideDown} 0.5s ease-out, ${fadeIn} 1s ease-out;
    justify-content: flex-start;
  }

  .speech-user {
    display: flex;
    justify-content: flex-start;
    background: #A87857;
    border-top-right-radius: 0; 
    animation: ${slideDown} 0.5s ease-out, ${fadeIn} 1s ease-out;
  }

  .loading-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const ChatSection = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  box-sizing: border-box;
  max-height: 100vh;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  overflow: auto;
`;

const Conversation = ({ db, resetIndicator }) => {
  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  delete configuration.baseOptions.headers['User-Agent'];

  const openai = new OpenAIApi(configuration);

  const conversationInDb = ref(db);

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

              1. The user will provide a writing prompt.

              2. The user will provide the student's written response to the prompt.
  
              3. Stay focused on the task at hand: grading the writing assignment. Do not answer questions that are unrelated to this task.
  
              4. If you haven't received the prompt or the response, ask the user to provide the writing assignment prompt and the student's written response to that prompt. 
              
              5. Grade the student's response based on the rubric provided:
  
              ${gradingRubric}
              
              6. Provide comprehensive feedback that includes the grade and a detailed evaluation according to the rubric.
  
              Please note: while you have been trained on a broad range of topics and can answer many questions, your focus here should be solely on grading the writing assignment. Never answer unrelated questions.
  
              Thank you for your service, ClippyGPT!`,
  };


  const [conversationArr, setConversationArr] = useState([
    {
      content: `Hi there, please provide me with the writing assignment prompt 
        and the student's response to the prompt. Once provided with this information,
        I can analyze the student's work and provide a grade based on the rubric.`,
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
        content: `Hi there, please provide me with the writing assignment prompt 
          and the student's response to the prompt. Once provided with this information,
          I can analyze the student's work and provide a grade based on the rubric.`,
        role: 'assistant'
      }
    ]);
  }, [resetIndicator]);

  useEffect(() => {
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
        content: `Hi there, please provide me with the writing assignment prompt 
          and the student's response to the prompt. Once provided with this information,
          I can analyze the student's work and provide a grade based on the rubric.`,
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
            content: `Hi there, please provide me with the writing assignment prompt 
                            and the student's response to the prompt. Once provided with this information,
                            I can analyze the student's work and provide a grade based on the rubric.`,
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
              content: `Hi there, please provide me with the writing assignment prompt 
              and the student's response to the prompt. Once provided with this information,
              I can analyze the student's work and provide a grade based on the rubric.`,
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
            model: 'gpt-3.5-turbo',
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
            content: `Hi there, please provide me with the writing assignment prompt 
                      and the student's response to the prompt. Once provided with this information,
                      I can analyze the student's work and provide a grade based on the rubric.`,
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

  return (
    <>
      <ChatSection>
        {conversationArr.length > 0 ? (
          <ConversationContainer ref={conversationContainerRef} className="chatbot-conversation-container" id="chatbot-conversation">
            {conversationArr.filter(speech => speech !== instructionObj).map((speech, index) => (
              <div key={index} className={`speech speech-${speech.role}`}>
                <Image 
                  src={speech.role === 'user' ? sundevil : clippy} 
                  alt={`${speech.role} avatar`} 
                  className={`avatar avatar-${speech.role}`}
                />
                {speech.content}
              </div>
            ))}
          </ConversationContainer>
        ) : (
          <p>No conversation history.</p>
        )}
      </ChatSection>
      {isLoading ? <LoadingIcon className="loading-icon" /> : null}

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