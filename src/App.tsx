import {  Check, ChevronLeft, ChevronRight, ChevronsUpDown, Leaf } from "lucide-react"
import { Card, CardContent, CardHeader } from "./components/ui/card"
import { ModeToggle } from "./components/mode-toggle"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./components/ui/form"
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from "react"
import { Input } from "./components/ui/input"
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group"
import { Label } from "./components/ui/label"
import { Button } from "./components/ui/button"
import { FormSchema, steps, type FormData } from '@/lib/schema'
import { cepMask, cnpjMask, cpfMask, phoneMask, removeMask } from '@/utils/masks'
import { toast } from "sonner"
import { Checkbox } from "./components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover"
import { states } from "./utils/states"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./components/ui/command"
import { cn } from "./lib/utils"
import { motion } from 'framer-motion'


function App() {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [cnpjLoading, setCnpjLoading] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)
  const [isAddressLocked, setIsAddressLocked] = useState(false)
  const delta = currentStep - previousStep


  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      nomeCompleto: '',
      email: '',
      telefone: '',
      tipoPessoa: 'PJ',
      cpf: '',
      cnpj: '',
      razaoSocial: '',
      nomeFantasia: '',
      cep: '',
      endereco: '',
      numero: '',
      bairro: '',
      complemento: '',
      estado: '',
      cidade: '',
    }
  })

  const { watch, trigger, handleSubmit } = form
  const watchTipoPessoa = watch('tipoPessoa');
  const watchCnpj = watch("cnpj")
  const watchCep = watch("cep")

  type FieldName = keyof FormData;

  

  const nextStep = async () => {
    const fields = steps[currentStep].fields
    const output = await trigger(fields as FieldName[], { shouldFocus: true })

    if (!output) return

    
    if (currentStep < steps.length - 1) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step + 1)
    } else {
      await handleSubmit(onSubmit)()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step - 1)
    }
  }

  const onSubmit = (data: FormData) => {
    const cleanData = {
      ...data,
      telefone: data.telefone ? removeMask(data.telefone) : '',
      cpf: data.cpf ? removeMask(data.cpf) : '',
      cnpj: data.cnpj ? removeMask(data.cnpj) : '',
      cep: data.cep ? removeMask(data.cep) : '',
    };
  
    console.log('Dados limpos:', cleanData);
    toast.success('Cadastro realizado com sucesso!')
  }


  const handleCnpjData = async (cnpj: string) => {
  try {
    const cleanCnpj = removeMask(cnpj)

    const res = await fetch(`/api/cnpj/${cleanCnpj}`)
    const data = await res.json()

    if (data.status === "ERROR") {
      throw new Error(data.message || "CNPJ inválido")
    }

    return {
      razaoSocial: data.nome || "",
      nomeFantasia: data.fantasia || "",
    }
  } catch (error: any) {
    toast.error("Erro ao buscar CNPJ", {
      description: error.message || "Não foi possível consultar os dados.",
    })
    return null
  }
}

const handleCepData = async (cep: string) => {
  try {
    const response = await fetch(`/api/cep/${cep}/json`)
    const data = await response.json()

    if (data.erro) {
      toast.error("CEP não encontrado")
      setIsAddressLocked(false)
      return null
    }

    form.setValue("endereco", data.logradouro || "")
    form.setValue("bairro", data.bairro || "")
    form.setValue("cidade", data.localidade || "")
    form.setValue("estado", data.uf || "")

    setIsAddressLocked(true) // trava edição
    return data
  } catch (error) {
    console.error(error)
    toast.error("Erro ao buscar o CEP")
    setIsAddressLocked(false)
    return null
  }
}

useEffect(() => {
  const cleanCnpj = removeMask(watchCnpj || "")

  if (cleanCnpj.length === 14) {
    const timeout = setTimeout(async () => {
      setCnpjLoading(true)
      const data = await handleCnpjData(cleanCnpj)
      setCnpjLoading(false)

      if (data) {
        form.setValue("razaoSocial", data.razaoSocial)
        form.setValue("nomeFantasia", data.nomeFantasia)
      }
    }, 500) 

    return () => clearTimeout(timeout)
  }
}, [watchCnpj])

useEffect(() => {
  const cleanCep = removeMask(watchCep || "")

  if (cleanCep.length === 8) {
    const timeout = setTimeout(async () => {
      setCepLoading(true)
      const data = await handleCepData(cleanCep)
      setCepLoading(false)
    }, 500)

    return () => clearTimeout(timeout)
  } else {
    setIsAddressLocked(false)
    form.setValue("endereco", "")
    form.setValue("bairro", "")
    form.setValue("cidade", "")
    form.setValue("estado", "")
  }
}, [watchCep])
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 dark:from-neutral-950 via-neutral-100 dark:via-neutral-900 to-emerald-100 dark:to-emerald-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="pb-6 justify-between flex">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-brand-dark">Guarani Sistemas</h1>
          </div>
          <ModeToggle/>
        </CardHeader>

        <CardContent>
          {/* steps */}
          <nav aria-label='Progress'>
            <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
              {steps.map((step, index) => (
                <li key={step.name} className='md:flex-1'>
                  {currentStep > index ? (
                    <div className='group flex w-full flex-col border-l-4 border-emerald-400 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                      <span className='text-sm font-medium text-emerald-400 transition-colors '>
                        {step.id}
                      </span>
                      <span className='text-sm font-medium'>{step.name}</span>
                    </div>
                  ) : currentStep === index ? (
                    <div
                      className='flex w-full flex-col border-l-4 border-emerald-400 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                      aria-current='step'
                    >
                      <span className='text-sm font-medium text-emerald-400'>
                        {step.id}
                      </span>
                      <span className='text-sm font-medium'>{step.name}</span>
                    </div>
                  ) : (
                    <div className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                      <span className='text-sm font-medium text-gray-500 transition-colors'>
                        {step.id}
                      </span>
                      <span className='text-sm font-medium'>{step.name}</span>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-12">
              {currentStep === 0 && (
                <motion.div
                  initial={{ x: delta >= 0 ? '5%' : '-1%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nomeCompleto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite seu nome completo"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="seu@email.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="telefone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="(11) 99999-9999"
                                {...field}
                                onChange={(e) => {
                                  const maskedValue = phoneMask(e.target.value);
                                  field.onChange(maskedValue);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="tipoPessoa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Pessoa *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="PF" id="pf" />
                                <Label htmlFor="pf">
                                  Pessoa Física
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="PJ" id="pj" />
                                <Label htmlFor="pj">
                                  Pessoa Jurídica
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchTipoPessoa === 'PF' && (
                      <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="000.000.000-00"
                                {...field}
                                onChange={(e) => {
                                  const maskedValue = cpfMask(e.target.value)
                                  field.onChange(maskedValue)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {watchTipoPessoa === 'PJ' && (
                      <>
                        <FormField
                          control={form.control}
                          name="cnpj"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CNPJ *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    placeholder="00.000.000/0000-00"
                                    {...field}
                                    onChange={(e) => {
                                      const maskedValue = cnpjMask(e.target.value)
                                      field.onChange(maskedValue)
                                    }}
                                    disabled={cnpjLoading}
                                  />
                                  {cnpjLoading && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                          <FormField
                            control={form.control}
                            name="razaoSocial"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Razão Social *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Razão social da empresa"
                                    {...field}
                                    disabled={true}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="nomeFantasia"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome Fantasia *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Nome fantasia da empresa"
                                    {...field}
                                    disabled={true}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  initial={{ x: delta >= 0 ? '1%' : '-5%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="cep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP *
                            <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank"
                            className="text-xs text-sky-200">
                              Não sei meu CEP
                            </a>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Digite seu CEP"
                                {...field}
                                onChange={(e) => {
                                  const maskedValue = cepMask(e.target.value)
                                  field.onChange(maskedValue)
                                }}
                                disabled={cepLoading}
                              />
                              {cepLoading && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                  <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              )}
                            </div>
                            
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endereco"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Digite seu endereço"
                              {...field}
                              disabled={isAddressLocked}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                      <FormField
                        control={form.control}
                        name="numero"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Digite o número"
                                {...field}
                                disabled={field.value === "SN"}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="numero"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 mt-7">
                            <FormControl>
                              <Checkbox
                                checked={field.value === "SN"}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    field.onChange("SN")
                                  } else {
                                    field.onChange("")
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">Não possui número</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                      <FormField
                        control={form.control}
                        name="bairro"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bairro</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Digite seu bairro"
                                {...field}
                                disabled={isAddressLocked}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="complemento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complemento</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Digite o complemento"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                      <FormField
                        control={form.control}
                        name="estado"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Estado *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "w-full justify-between",
                                      !field.value && "text-muted-foreground"
                                    )}
                                    disabled={isAddressLocked}
                                  >
                                    {field.value
                                      ? states.find((st) => st.value === field.value)?.label
                                      : "Selecione o estado"}
                                    <ChevronsUpDown className="opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[200px] p-0">
                                <Command>
                                  <CommandInput placeholder="Buscar estado..." className="h-9" />
                                  <CommandList>
                                    <CommandEmpty>Nenhum estado encontrado.</CommandEmpty>
                                    <CommandGroup>
                                      {states.map((st) => (
                                        <CommandItem
                                          value={st.label}
                                          key={st.value}
                                          onSelect={() => form.setValue("estado", st.value)}
                                        >
                                          {st.label}
                                          <Check
                                            className={cn(
                                              "ml-auto",
                                              st.value === field.value ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cidade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade *</FormLabel>
                            <FormControl>
                              <Input placeholder="Digite a cidade" {...field} 
                              disabled={isAddressLocked}/>
                              
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </form>
          </Form>

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>

            <Button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Cadastrar' : 'Próximo'}
              {currentStep !== steps.length - 1 && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
