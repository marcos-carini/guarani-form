import {  ChevronLeft, ChevronRight, Leaf } from "lucide-react"
import { Card, CardContent, CardHeader } from "./components/ui/card"
import { ModeToggle } from "./components/mode-toggle"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./components/ui/form"
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from "react"
import { Input } from "./components/ui/input"
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group"
import { Label } from "./components/ui/label"
import { Button } from "./components/ui/button"
import { FormSchema, steps, type FormData } from '@/lib/schema'
import { phoneMask, removePhoneMask } from '@/lib/masks'


function App() {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

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
    }
  })

  const { watch, trigger, handleSubmit } = form
  const watchTipoPessoa = watch('tipoPessoa');

  type FieldName = keyof FormData;

  

  const nextStep = async () => {
    const fields = steps[currentStep].fields
    const output = await trigger(fields as FieldName[], { shouldFocus: true })

    if (!output) return

    
    if (currentStep < steps.length - 1) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step + 1)
    } else {
      await handleSubmit(processForm)()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step - 1)
    }
  }

  const onSubmit = (data: FormData) => {
    console.log('Dados do formulário:', data)
    processForm(data);
  }

  const processForm = (data: FormData) => {
    const cleanData = {
    ...data,
    telefone: data.telefone ? removePhoneMask(data.telefone) : '',
  };
  
  console.log('Dados limpos:', cleanData);
  
  }
  

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
                    <div className='group flex w-full flex-col border-l-4 border-emerald-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              <Input
                                placeholder="00.000.000/0000-00"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              )}

              {currentStep === 1 && (
                <div className="text-center py-12">
                  <h3 className="text-xl text-white mb-4">Dados de Endereço</h3>
                  <p className="text-gray-400">Em breve...</p>
                </div>
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
