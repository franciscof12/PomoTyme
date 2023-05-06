import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, Avatar, ConversationHeader } from '@chatscope/chat-ui-kit-react'
import { useState } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'


const POMO_API_KEY = ''// API key de CHATGPT


const Pomochat = () => {
    // State para controlar el estado del indicador de escritura
    const [escribiendo, setEscribiendo] = useState(false);
    // State para mantener los mensajes de chat
    const [mensajes, setmensajes] = useState([{
        message: "Hola, mi nombre es PomoGPT!, ¿en que puedo ayudarte?",
        direction: 'incoming',
        sender: 'PomoGPT'
    }])

    // Función para enviar un mensaje al chat
    const enviar = async (message) => {
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: 'user',
        }

        // Agrega el nuevo mensaje a la lista de mensajes
        const newMensajes = [...mensajes, newMessage]

        // Actualiza los mensajes en el state
        setmensajes(newMensajes)

        // Muestra el indicador de escritura de PomoGPT
        setEscribiendo(true)

        // Procesa el mensaje con la API de PomoGPT y actualiza el chat
        await procesarMensajePomoGPT(newMensajes)
    }


    async function procesarMensajePomoGPT(chatMensajes) {
        let apiMensajes = chatMensajes.map((objetoMensaje) => {
            const role = objetoMensaje.sender === 'PomoGPT' ? 'assistant' : 'user';
            return {
                role: role,
                content: objetoMensaje.message
            }
        })

        // Defino en que forma quiero que hable la API de chatgpt
        const systemMessage = {
            role: 'system',
            content: "Explain everything as if you were a high school teacher who teaches teenagers between the ages of 16 and 19. Explain everything in a brief and detailed manner so that it is easy to understand."
        }

        const apiRequestBody = {
            "model": 'gpt-3.5-turbo',
            'messages': [
                systemMessage,
                ...apiMensajes
            ]
        }

        // Realiza una solicitud a la API de OpenAI utilizando fetch
        await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + POMO_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((data) => {
            return data.json()
        }).then((data) => {
            // Actualiza el estado de los mensajes con la respuesta de PomoGPT
            setmensajes(
                [...chatMensajes, {
                    message: data.choices[0].message.content,
                    sender: 'PomoGPT'
                }]
            )
            // Desactiva el indicador de escritura de PomoGPT cuando envia la respuesta
            setEscribiendo(false)
        })
    }



    return (
        <div style={{ position: 'relative', height: '500px', width: '100%' }}>
            <MainContainer style={{ border: 'none', borderRadius: '10px' }}>
                <ChatContainer>
                    <ConversationHeader style={{ border: 'none', backgroundColor: '#7895B2' }}  >
                        <Avatar src='robot.png' name="PomoGPT" />
                    </ConversationHeader>
                    <MessageList style={{ border: 'none', backgroundColor: '#7895B2', padding:'15px' }}
                        scrollBehavior='smooth'
                        typingIndicator={escribiendo ? <TypingIndicator style={{ border: 'none', backgroundColor: 'transparent', borderRadius: '30px' }} content='PomoGPT esta escribiendo' /> : null}>
                        {mensajes.map((mensaje, i) => {
                            return <Message style={{ borderRadius: '15px' }} key={i} model={mensaje} />
                        })}
                    </MessageList>
                    <MessageInput style={{padding:'15px', backgroundColor: '#7895B2', borderTop: 'rgba(96, 59, 11, 0.78)' }} attachButton={false} placeholder='Preguntame lo que quieras!' onSend={enviar} />
                </ChatContainer>
            </MainContainer>
        </div>
    )
}

export default Pomochat