import { Notify } from 'vant';
import { defineComponent, onMounted, PropType, reactive, toRaw } from 'vue';
import { routerKey, useRoute, useRouter } from 'vue-router';
import { Button } from '../../shared/Button';
import { Form, FormItem } from '../../shared/Form';
import { http } from '../../shared/Http';
import { onFormError } from '../../shared/onFormError';
import { hasError, Rules, validate } from '../../shared/validate';
import s from './Tag.module.scss';
export const TagForm = defineComponent({
  props: {
    id: {
      type: Number
    }
  },
  setup: (props, context) => {
    const oldFormData = reactive<Partial<Tag>>({
      id: undefined,
      name: '',
      sign: '',
      kind: 'expenses',
    })
    onMounted(async ()=>{
      if(!props.id){ return }
      const response = await http.get<Resource<Tag>>(`/tags/${props.id}`,{      },{
        _autoLoading: true,
      })
      formData.name = response.data.resource.name
      formData.kind = response.data.resource.kind
      formData.sign = response.data.resource.sign
      formData.id = response.data.resource.id
      oldFormData.name = response.data.resource.name
      oldFormData.kind = response.data.resource.kind
      oldFormData.sign = response.data.resource.sign
      oldFormData.id = response.data.resource.id
    })
    const route = useRoute()
    const router = useRouter()
    const resetFormDate = ()=>{
      formData.name = '',
      formData.sign = '',
      formData.kind = 'expenses'
    }
    const formData = reactive<Partial<Tag>>({
      id: undefined,
      name: '',
      sign: '',
      kind: 'expenses',
    })
    onMounted(()=>{
      if(route.query.kind){
        formData.kind = route.query.kind!.toString()
      }
    })
    const errors = reactive<{ [k in keyof typeof formData]?: string[] }>({})
    const onError = (error: any) => {
        Object.assign(errors, error.data.errors)
      throw error
    }
    const onSubmit = async (e: Event) => {
      e.preventDefault()
      const rules: Rules<typeof formData> = [
        { key: 'name', type: 'required', message: '??????' },
        { key: 'sign', type: 'required', message: '??????' },
      ]
      Object.assign(errors, {
        name: [],
        sign: [],
        kind: [],
      })
      Object.assign(errors, validate(formData, rules))
      if(!hasError(errors)){
        if(formData.id){
          await http.patch(`tags/${formData.id}`,formData, {_autoLoading: true}).catch((error)=> onFormError(error, (data)=> Object.assign(errors, data.errors)))
          router.back()
          Notify({ type: 'success', message: '?????????????????????', position: 'bottom' });
        }else{
          debugger
          await http.post('/tags', formData, {_autoLoading: true}).catch(onError).catch((error)=> onFormError(error, (data)=> Object.assign(errors, data.errors)))
          resetFormDate()
          Notify({ type: 'success', message: '????????????????????????', position: 'bottom' });
          router.back()
        }
      }
    }
    return () => <>
      <Form onSubmit={onSubmit}>
        <FormItem label='??????'
          type="text"
          maxlength={4}
          v-model={formData.name}
          error={errors['name']?.[0]} />
        <FormItem label={'?????? ' + formData.sign}
          type="emojiSelect" v-model={formData.sign}
          error={errors['sign']?.[0]} />
        {/* <FormItem label='??????' type="select" options={[
          { value: 'expenses', text: '??????' },
          { value: 'income', text: '??????' }
        ]} v-model={formData.kind} /> */}
        <FormItem>
          <p class={s.tips}>???????????????????????????????????????</p>
        </FormItem>
        <FormItem>
          <Button type="submit" class={[s.button]}>??????</Button>
        </FormItem>
      </Form>
    </>
  }
})