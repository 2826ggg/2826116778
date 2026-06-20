frontend/
│
├── src/
│   ├── pages/
│   │    ├── Home.jsx        # 首页
│   │    ├── Login.jsx       # 登录
│   │    ├── Register.jsx    # 注册
│   │
│   ├── assets/
│   │    └── cover.png       # 你的封面图
│   │
│   ├── App.js
│   ├── index.js
│
└── package.json
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
import { useNavigate } from "react-router-dom";
import cover from "../assets/cover.png";

export default function Home() {
  const nav = useNavigate();

  return (
    <div style={styles.container}>

      <div style={styles.bg}></div>

      <div style={styles.content}>
        <h1 style={styles.title}>GLOBAL CRYPTO EXCHANGE</h1>

        <p style={styles.sub}>
          Secure · Fast · Multi-chain Trading Platform
        </p>

        <div style={styles.btnRow}>
          <button style={styles.btnPrimary} onClick={() => nav("/register")}>
            开始注册
          </button>

          <button style={styles.btn} onClick={() => nav("/login")}>
            登录
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    position: "relative",
    overflow: "hidden",
    fontFamily: "Arial",
  },

  bg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundImage: `url(${cover})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "brightness(0.35)",
  },

  content: {
    position: "relative",
    zIndex: 2,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },

  title: {
    fontSize: "50px",
    color: "#d4af37",
    letterSpacing: "3px",
  },

  sub: {
    marginTop: 10,
    color: "#ccc",
  },

  btnRow: {
    marginTop: 30,
    display: "flex",
    gap: 20,
  },

  btnPrimary: {
    padding: "12px 25px",
    background: "#d4af37",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },

  btn: {
    padding: "12px 25px",
    background: "transparent",
    border: "1px solid #d4af37",
    color: "#d4af37",
    cursor: "pointer",
  },
};
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if (!email || !password) {
      alert("请输入完整信息");
      return;
    }

    alert("登录成功（示例）");

    nav("/"); // 跳回首页
  };

  return (
    <div style={styles.bg}>
      <div style={styles.box}>
        <h2 style={styles.title}>LOGIN</h2>

        <input
          placeholder="邮箱"
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="密码"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={login} style={styles.btn}>
          登录
        </button>

        <p style={styles.link} onClick={() => nav("/register")}>
          没有账号？去注册
        </p>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    height: "100vh",
    background: "#0a0a0a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  box: {
    width: 320,
    padding: 30,
    background: "#111",
    border: "1px solid #333",
    borderRadius: 10,
  },

  title: {
    color: "#d4af37",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    background: "#000",
    border: "1px solid #333",
    color: "#fff",
  },

  btn: {
    width: "100%",
    padding: 10,
    marginTop: 20,
    background: "#d4af37",
    border: "none",
    cursor: "pointer",
  },

  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#aaa",
    cursor: "pointer",
  },
};
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = () => {
    if (!email || !password) {
      alert("请填写完整信息");
      return;
    }

    alert("注册成功（示例）");

    nav("/login"); // 注册后跳登录
  };

  return (
    <div style={styles.bg}>
      <div style={styles.box}>
        <h2 style={styles.title}>REGISTER</h2>

        <input
          placeholder="邮箱"
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="密码"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={register} style={styles.btn}>
          注册
        </button>

        <p style={styles.link} onClick={() => nav("/login")}>
          已有账号？去登录
        </p>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    height: "100vh",
    background: "#0a0a0a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  box: {
    width: 320,
    padding: 30,
    background: "#111",
    border: "1px solid #333",
    borderRadius: 10,
  },

  title: {
    color: "#d4af37",
    textAlign: "center",
    marginBottom: 20,
  },

  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    background: "#000",
    border: "1px solid #333",
    color: "#fff",
  },

  btn: {
    width: "100%",
    padding: 10,
    marginTop: 20,
    background: "#d4af37",
    border: "none",
    cursor: "pointer",
  },

  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#aaa",
    cursor: "pointer",
  },
};
npm start
http://alhost:3000
