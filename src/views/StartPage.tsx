import { defineComponent, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../shared/Button';
import { Center } from '../shared/Center';
import { FloatButton } from '../shared/FloatButton';
import { Icon } from '../shared/Icon';
import { Navbar } from '../shared/Navbar';
import { Overlay, OverlayIcon } from '../shared/Overlay';
import s from './StartPage.module.scss';
export const StartPage = defineComponent({
  setup: (props, context) => {
    return () => (
      <MainLayout>{
        {
          title: () => '蓝猫记账',
          icon: () => <OverlayIcon />,
          default: () => <>
            <Center class={s.pig_wrapper}>
              <Icon name="start" class={s.pig} />
            </Center>
            <div class={s.button_wrapper}>
              <RouterLink to="/items/create">
                <Button class={s.button}>开始记账</Button>
              </RouterLink>
            </div>
            <FloatButton iconName='add' />
          </>
        }
      }</MainLayout>
    )
  }
})