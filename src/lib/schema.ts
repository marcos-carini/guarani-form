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
    fields: [] as (keyof FormData)[]
  },
]