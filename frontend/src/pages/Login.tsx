import { FormEvent, useState } from "react";
import { api } from "../api/client";

type Usuario = {
    id: number;
    nome: string;
    email: string;
};

export function Login() {
    const [modoCadastro, setModoCadastro] = useState(false);
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");
    setSucesso("");

    const form = new FormData(event.currentTarget);

    const payload = {
      nome: String(form.get("nome") || ""),
      email: String(form.get("email") || ""),
      senha: String(form.get("senha") || ""),
    };

    try {
      if (modoCadastro) {
        await api.post("/auth/cadastro", payload);

        setSucesso("Cadastro realizado com sucesso. Agora faça login.");
        setModoCadastro(false);
        event.currentTarget.reset();
        return;
      }

      const { data } = await api.post("/auth/login", {
        email: payload.email,
        senha: payload.senha,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      setUsuario(data.usuario);
      setSucesso("Login realizado com sucesso.");
      event.currentTarget.reset();
    } catch (error: any) {
      console.log("Erro de autenticação:", error.response?.data || error);

      setErro(
        error.response?.data?.message ||
          "Não foi possível concluir a operação."
      );
    }
  }

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
    setSucesso("");
    setErro("");
  }

  if (usuario) {
    return (
      <section className="card">
        <h2>Minha conta</h2>

        <p>
          Você está logado como <strong>{usuario.nome}</strong>.
        </p>

        <p className="muted">{usuario.email}</p>

        <button type="button" onClick={sair}>
          Sair
        </button>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>{modoCadastro ? "Criar conta" : "Entrar"}</h2>

      <p className="muted">
        A conta permite registrar manifestações identificadas e acompanhar dados
        do usuário no sistema.
      </p>

      <form onSubmit={enviar} className="form">
        {modoCadastro && (
          <>
            <label>Nome</label>
            <input name="nome" placeholder="Seu nome" required />
          </>
        )}

        <label>E-mail</label>
        <input name="email" type="email" placeholder="seu@email.com" required />

        <label>Senha</label>
        <input name="senha" type="password" placeholder="Sua senha" required />

        <button type="submit">
          {modoCadastro ? "Cadastrar" : "Entrar"}
        </button>
      </form>

      <button
        type="button"
        className="link-button"
        onClick={() => {
          setModoCadastro(!modoCadastro);
          setErro("");
          setSucesso("");
        }}
      >
        {modoCadastro
          ? "Já tenho conta"
          : "Ainda não tenho conta"}
      </button>

      {sucesso && <div className="success">{sucesso}</div>}
      {erro && <div className="error">{erro}</div>}
    </section>
  );
}
