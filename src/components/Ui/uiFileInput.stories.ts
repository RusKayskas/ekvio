import { defineComponent } from 'vue'
import UiFileInput from './UiFileInput.vue'
import '@/assets/main.css'

export default {
  title: 'Components/UiFileInput',
  component: UiFileInput
}

export const Default = defineComponent({
  components: { UiFileInput },
  setup() {
    // Описание пропсов для передачи в компонент UiFileInput
    const props = {
      title: 'Заголовок компонента', // Заголовок компонента
      defaultText: 'Выберите файл', // Текст по умолчанию
      fileType: 'image/', // Тип файла (по умолчанию - изображения)
      maxFileSize: 5 * 1024 * 1024, // Максимальный размер файла (по умолчанию - 5 МБ)
      disabled: false, // Флаг, указывающий, отключен ли компонент
      hintText: {
        default: 'Подсказка', // Стандартная подсказка
        formatError: 'Неправильный формат файла.', // Подсказка при неверном формате файла
        maxSizeError: 'Максимальный размер файла 5 MB' // Подсказка при превышении максимального размера файла
      },
      buttonStates: {
        default: 'Выбрать файл', // Стандартное состояние кнопки
        upload: 'Отменить', // Состояние кнопки во время загрузки файла
        delete: 'Удалить' // Состояние кнопки после выбора файла
      }
    }

    // Список ключей и значений объекта hintText
    const hintTextList = Object.entries(props.hintText).map(([key, value]) => ({ key, value }))

    return {
      props,
      hintTextList
    }
  },
  template: `
    <div style="font-family: Arial, sans-serif;">
      <UiFileInput 
        :title="props.title" 
        :defaultText="props.defaultText" 
        :fileType="props.fileType" 
        :maxFileSize="props.maxFileSize" 
        :disabled="props.disabled" 
        :hintText="props.hintText" 
        :buttonStates="props.buttonStates" 
      />
      <div style="margin-top: 20px;">
        <h4>HintText</h4>
        <ul>
          <li v-for="hint in hintTextList" :key="hint.key">
            <strong>{{ hint.key }}:</strong> {{ hint.value }}
          </li>
        </ul>
      </div>
    </div>
  `
})
