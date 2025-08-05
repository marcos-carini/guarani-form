import { isValidCNPJ } from '@/utils/helpers';
import { z } from 'zod'

export const FormSchema = z.object({
  nomeCompleto: z.string().min(1, 'Nome é obrigatório').refine((name) => name.trim().split(' ').length >= 2, {
    message: 'Digite nome e sobrenome'
  }),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().optional(),
  tipoPessoa: z.enum(['PF', 'PJ']),
  cpf: z.string().optional(),
  cnpj: z.string()
  .refine((value) => isValidCNPJ(value), {
    message: "CNPJ inválido",
  })
  .optional(),
  razaoSocial: z.string().optional(),
  nomeFantasia: z.string().optional(),
}).refine((data) => {
  if (data.tipoPessoa === 'PF') {
    return data.cpf && data.cpf.length > 0;
  }
  if (data.tipoPessoa === 'PJ') {
    return data.cnpj && data.cnpj.length > 0 && 
           data.razaoSocial && data.razaoSocial.length > 0
  }
  return true;
}, {
  message: "Preencha os campos obrigatórios conforme o tipo de pessoa",
  path: ["tipoPessoa"]
});

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