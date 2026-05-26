import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const setores = [
    {
      id: 1,
      nome: "Coordenação de Curso",
      email: "coordenacao@uespi.br",
    },
    {
      id: 2,
      nome: "Infraestrutura",
      email: "infraestrutura@uespi.br",
    },
    {
      id: 3,
      nome: "Assistência Estudantil",
      email: "assistencia@uespi.br",
    },
    {
      id: 4,
      nome: "Biblioteca",
      email: "biblioteca@uespi.br",
    },
    {
      id: 5,
      nome: "Tecnologia da Informação",
      email: "ti@uespi.br",
    },
    {
      id: 6,
      nome: "Ouvidoria Geral",
      email: "ouvidoria@uespi.br",
    },
  ];

  for (const setor of setores) {
    await prisma.setor.upsert({
      where: {
        id: setor.id,
      },
      update: {
        nome: setor.nome,
        email: setor.email,
      },
      create: setor,
    });
  }

  console.log("Setores cadastrados com sucesso.");
}

main()
  .catch((error) => {
    console.error("Erro ao cadastrar setores:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });