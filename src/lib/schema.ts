import { isValidCNPJ, isValidCPF } from '@/utils/validators'
import { z } from 'zod'

export const FormSchema = z.object({
  nomeCompleto: z.string().min(1, 'Nome é obrigatório').refine((name) => name.trim().split(' ').length >= 2, {
    message: 'Digite nome e sobrenome'
  }),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  tipoPessoa: z.enum(['PF', 'PJ']),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  razaoSocial: z.string().optional(),
  nomeFantasia: z.string().optional(),
  cep: z.string().min(9, "CEP inválido"),
  endereco: z.string().min(1, "Endereço obrigatório"),
  numero: z.string().min(1, "Se não tiver número, marque a opção  'Não possui número'"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Bairro obrigatório"),
  estado: z.string().min(2, "Estado obrigatório").max(2, "Use apenas a sigla UF"),
  cidade: z.string().min(1, "Cidade obrigatória"),
}).superRefine((data, ctx) => {
  if (data.tipoPessoa === 'PF') {
    if (!data.cpf || !isValidCPF(data.cpf)) {
      ctx.addIssue({
        path: ["cpf"],
        code: "custom",
        message: "CPF inválido",
      })
    }
  }

  if (data.tipoPessoa === 'PJ') {
    if (!data.cnpj || !isValidCNPJ(data.cnpj)) {
      ctx.addIssue({
        path: ["cnpj"],
        code: "custom",
        message: "CNPJ inválido",
      })
    }

    if (!data.razaoSocial) {
      ctx.addIssue({
        path: ["razaoSocial"],
        code: "custom",
        message: "Razão Social é obrigatória",
      })
    }
  }
})

export type FormData = z.infer<typeof FormSchema>

export const steps = [
  {
    id: 'Passo 1',
    name: 'Informações Pessoais',
    fields: ['nomeCompleto', 'email', 'telefone', 'tipoPessoa', 'cpf', 'cnpj', 'razaoSocial', 'nomeFantasia'] as (keyof FormData)[]
  },
  {
    id: 'Passo 2',
    name: 'Endereço',
    fields: [
      'cep',
      'endereco',
      'numero',
      'complemento',
      'bairro',
      'estado',
      'cidade',
    ] as (keyof FormData)[],
  },
]