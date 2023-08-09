
import {Button, Form, Input} from "antd";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useState} from "react";


type FieldType = {
    pseudo?: string
    email?: string;
    password?: string;
}
const RegisterPage = () => {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const onFinish = (values : FieldType) => {
        const email = values.email;
        const password = values.password
        const pseudo = values.pseudo
        if (email && password) {
            axios.post(`${import.meta.env.VITE_API_URL}/register`, {
                mail: email,
                password: password,
                pseudo: pseudo ? pseudo : "Anonymous"
            }).then(res => {
                console.log(res)
                if (res.status == 201 && res.data == "User inserted") {
                    navigate("/auth/login")
                }
            }).catch(err => {
                console.log(err)
                if (err.response.data === "Email already exist" && err.response.status === 400) {
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
                name="RegisterForm"
                labelCol={{span: 16}}
                style={{maxWidth: 600, width: 400}}>
                <Form.Item<FieldType> label="Pseudo" name="pseudo">
                    <Input/>
                </Form.Item>
                <Form.Item<FieldType> label="Email address" name="email" rules={[{required: true, message: "Please enter a valid email",type:"email"}]}>
                    <Input/>
                </Form.Item>
                <Form.Item<FieldType> label="Password" name="password" rules={[{required: true, message: "Please enter a valid password",type:"string"}]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item style={{width: '100%'}} wrapperCol={{span: 24}}>
                    <Button htmlType="submit"   type="primary">S'inscrire</Button>
                </Form.Item>
                {error.length > 0 && <p>{error}</p>}
                <p>Already subscribe ? <a onClick={() => navigate("/auth/login")}>Login</a></p>
            </Form>
        </div>
    );
};

export default RegisterPage;
