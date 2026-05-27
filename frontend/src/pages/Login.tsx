import { FormEvent, useEffect, useState } from "react";
import { api } from "../api/client";

type Usuario = {
  id: number;
  nome: string;
  email: string;
  admin?: boolean;
};

export function Login() {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  function carregarUsuarioSalvo() {
    const usuarioSalvo = sessionStorage.getItem("usuario");

    if (!usuarioSalvo) {
      setUsuario(null);
      return;
    }

    try {
      setUsuario(JSON.parse(usuarioSalvo));
    } catch {
      sessionStorage.removeItem("usuario");
      sessionStorage.removeItem("token");
      setUsuario(null);
    }
  }

  useEffect(() => {
    carregarUsuarioSalvo();
  }, []);

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formulario = event.currentTarget;

    setErro("");
    setSucesso("");

    const form = new FormData(formulario);

    const payload = {
      nome: String(form.get("nome") || ""),
      email: String(form.get("email") || ""),
      senha: String(form.get("senha") || ""),
    };

    try {
      if (modoCadastro) {
        await api.post("/auth/cadastro", payload);

        setErro("");
        setSucesso("Cadastro realizado com sucesso. Agora faça login.");
        setModoCadastro(false);
        formulario.reset();
        return;
      }

      const { data } = await api.post("/auth/login", {
        email: payload.email,
        senha: payload.senha,
      });

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("usuario", JSON.stringify(data.usuario));

      setErro("");
      setUsuario(data.usuario);
      setSucesso("Login realizado com sucesso.");

      window.dispatchEvent(new Event("auth-change"));

      formulario.reset();
    } catch (error: any) {
      console.log("Erro de autenticação:", error.response?.data || error);

      setSucesso("");
      setErro(
        error.response?.data?.message ||
          "Não foi possível concluir a operação."
      );
    }
  }

  function sair() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");

    setUsuario(null);
    setSucesso("");
    setErro("");

    window.dispatchEvent(new Event("auth-change"));
  }

  if (usuario) {
    return (
      <section className="card">
        <h2>Minha conta</h2>

        <p>
          Você está logado como <strong>{usuario.nome}</strong>.
        </p>

        <p className="muted">{usuario.email}</p>

        {usuario.admin && (
          <div className="success">
            Este usuário possui acesso de administrador.
          </div>
        )}

        {!usuario.admin && (
          <p className="muted">
            Este usuário possui acesso comum.
          </p>
        )}

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
        {modoCadastro ? "Já tenho conta" : "Ainda não tenho conta"}
      </button>

      {sucesso && <div className="success">{sucesso}</div>}
      {erro && <div className="error">{erro}</div>}
    </section>
  );
}