
import {Button, Form, Input} from "antd";
import {LogoutOutlined, PoweroffOutlined} from "@ant-design/icons";
import * as websocket from 'websocket';
import {useEffect, useState} from "react";
import {useNavigate, useRouteLoaderData} from "react-router-dom";



type message = {
    author: string
    message: string
}
const HomePage = () => {
    const [ws, setWs] = useState(new websocket.w3cwebsocket('ws://localhost:3000/ws'));
    const [messages, setMessage] = useState<message[]>([])
    const [form] = Form.useForm()
    const userData: any = useRouteLoaderData("root")
    const navigate = useNavigate()
    useEffect(() => {
        console.log(userData)
        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (e) => {
            console.log('Received:', e.data);
            const data = JSON.parse(e.data)
            setMessage(prevState => [...prevState, {author: data.author, message: data.message}])

        };

        ws.onclose = () => {
            console.log('WebSocket closed');
        };

        return () => {
            ws.close()
        }
    }, []);

    const onFinish = (value: any) => {
       const msg : string = value.message
        ws.send(JSON.stringify({
            author: userData.Pseudo,
            message: msg
        }))
        form.resetFields(["message"])

    }

    const logout = () => {
        localStorage.removeItem("userData")
        localStorage.removeItem("token")
        localStorage.removeItem("expiration")
        navigate("/auth/login")
    }

    return (
        <div style={{height: '100vh', width: '100vw', display: 'flex', justifyContent: 'space-between'}}>
           <div style={{ height: '90%', width: '15vw', display: "flex",flexDirection:'column', justifyContent: "flex-end"}}>
               <p style={{fontFamily: 'poppins', color: '#7f8fa6'}}>Bienvenue: {userData.Pseudo}</p>
               <Button
                   style={{width: '100%'}}
                   icon={<PoweroffOutlined />}
                   onClick={logout}
               >
                   Deconnexion
               </Button>
           </div>
            <div style={{display: 'flex', flexDirection:'column',width: '85vw', justifyContent: "flex-end", gap: 15}}>
                <div>
                    {messages.map((m, index) => (
                        <div key={index} style={{display: 'flex', flexDirection:'column',alignItems:m.author===userData.Pseudo ? "flex-start" : "flex-end"}}>
                            <h3 style={{fontFamily: 'poppins'}}>{m.author}</h3>
                            <p style={{fontFamily: 'poppins', color: '#7f8fa6'}}>{m.message}</p>
                        </div>
                    ))}
                </div>
                <Form onFinish={onFinish} form={form}>
                    <Form.Item name={"message"}>
                        <Input autoFocus addonAfter={<LogoutOutlined />}/>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default HomePage;
