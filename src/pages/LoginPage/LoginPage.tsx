import {Button, Form, Input} from "antd";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useState} from "react";
import {useRecoilState} from "recoil";
import {userState} from "../../context/UserContext.ts";


type FieldType = {
    email?: string;
    password?: string;
}

const LoginPage = () => {

    const navigate = useNavigate()
    const [error, setError] = useState("")
    const [userData, setUserData] = useRecoilState(userState)
    const onFinish = (values : FieldType) => {
        const email = values.email;
        const password = values.password
        console.log(email, password)
        if (email && password) {
            axios.post(`${import.meta.env.VITE_API_URL}/login`, {
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': "application/json",
                },
            }).then(res => {
                const authToken = res.headers['authorization'];

                const expiration = new Date();
                expiration.setHours(expiration.getHours() + 1);
                localStorage.setItem("token",authToken)
                localStorage.setItem('expiration', expiration.toISOString())
                localStorage.setItem("userData", JSON.stringify(res.data))
                setUserData({
                    id: res.data.Id,
                    pseudo: res.data.Pseudo
                })
                setTimeout(() => {
                    navigate("/")
                }, 5000)
            }).catch(err => {
                if (err.response.status == 502) {
                    setError(err.response.data)
                }
            })
        }
    }

    return (
        <div style={{height: '100vh', width: '50vw',margin: '0 auto', display: 'flex', alignItems:"center", justifyContent: "center"}}>
            <Form
                onFinish={onFinish}
                layout={"vertical"}
                name="LoginForm"
                labelCol={{span: 16}}
                style={{maxWidth: 600, width: 400}}>
                <Form.Item<FieldType> label="Email address" name="email" rules={[{required: true, message: "Please enter a valid email",type:"email"}]}>
                    <Input/>
                </Form.Item>
                <Form.Item<FieldType> label="Password" name="password" rules={[{required: true, message: "Please enter a valid password",type:"string"}]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item style={{width: '100%'}} wrapperCol={{span: 24}}>
                    <Button htmlType="submit"   type="primary">Se connecter</Button>
                </Form.Item>
                {error.length > 0 && <p>{error}</p>}
                <p>Not subscribe ? <a onClick={() => navigate("/auth/register")}>Register</a></p>
            </Form>
        </div>
    );
};

export default LoginPage;
