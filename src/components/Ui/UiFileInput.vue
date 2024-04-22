<template>
  <div class="ui-file-input">
    <span class="ui-file-input__title">{{ title }}</span>
    <div class="ui-file-input__body" :class="{ 'ui-file-input--disabled': disabled }">
      <input ref="fileInput" class="ui-file-input__input" type="file" name="file" @change="onFileInputChange"
        :disabled="disabled" :accept="accept">
      <UiButton :label="buttonLabel" class="ui-file-input__button" @click="onButtonClick" />
      <p :class="['ui-file-input__text', { 'ui-file-input__text--is-upload': isUploading || fileName }]">
        <svg v-if="isUploading" width="16" height="16" viewBox="0 0 16 16" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 8C16 9.58225 15.5308 11.129 14.6518 12.4446C13.7727 13.7602 12.5233 14.7855 11.0615 15.391C9.59966 15.9965 7.99113 16.155 6.43928 15.8463C4.88743 15.5376 3.46197 14.7757 2.34315 13.6569C1.22433 12.538 0.4624 11.1126 0.153718 9.56072C-0.154964 8.00887 0.00346269 6.40034 0.608964 4.93853C1.21446 3.47672 2.23985 2.22729 3.55544 1.34824C4.87103 0.469192 6.41775 -1.88681e-08 8 0V1.44C6.70255 1.44 5.43425 1.82474 4.35546 2.54556C3.27667 3.26638 2.43586 4.29091 1.93935 5.4896C1.44284 6.68828 1.31293 8.00728 1.56605 9.27979C1.81917 10.5523 2.44395 11.7212 3.36138 12.6386C4.27881 13.5561 5.44769 14.1808 6.72021 14.434C7.99272 14.6871 9.31172 14.5572 10.5104 14.0606C11.7091 13.5641 12.7336 12.7233 13.4544 11.6445C14.1753 10.5658 14.56 9.29745 14.56 8H16Z"
            fill="#00A8A5" />
        </svg>

        {{ getDefaultFileName() }}
      </p>
    </div>
    <span :class="['ui-file-input__hint-text', { 'ui-file-input__hint-text--is-error': isError }]">{{ hintText
      }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineProps, defineEmits } from 'vue';
import UiButton from './UiButton.vue';

export interface ButtonState {
  default: string;
  upload: string;
  delete: string;
}
export interface HintText {
  default: string;
  formatError: string;
  maxSizeError: string;
}

const props = defineProps({
  title: {
    type: String,
    default: 'Label'
  },
  defaultText: {
    type: String,
    default: 'Файл не выбран'
  },
  fileType: {
    type: String,
    default: 'image/'
  },
  maxFileSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5 MB
  },
  disabled: {
    type: Boolean,
    default: false
  },
  hintText: {
    type: Object as () => HintText,
    default: () => ({
      default: 'Hint text',
      formatError: 'Неправильный формат файла.',
      maxSizeError: 'Максимальный размер файла 5 MB'
    })
  },
  accept: {
    type: String,
    default: ''
  },
  buttonStates: {
    type: Object as () => ButtonState,
    default: () => ({
      default: 'Выбрать файл',
      upload: 'Отменить',
      delete: 'Удалить'
    })
  }
});

const emits = defineEmits(['fileUploaded']);

const fileInputRef = ref < HTMLInputElement | null > (null);
const fileName = ref < string > ('');
const isUploading = ref < boolean > (false);
const isError = ref < boolean > (false);
const hintText = ref < string > (props.hintText.default);

enum ErrorMessages {
  InvalidFormat = 'formatError',
  MaxSizeExceeded = 'maxSizeError'
}

onMounted(() => {
  fileInputRef.value = document.querySelector('.ui-file-input__input');
});

const openFileInput = (): void => {
  if (!props.disabled && fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const onButtonClick = (): void => {
  if (isUploading.value) {
    cancelUpload();
  } else if (fileName.value) {
    deleteFile();
    emits('fileUploaded', null);
  } else {
    openFileInput();
  }
};

const onFileInputChange = (event: Event): void => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) {
    return;
  }
  handleFileUpload(file);
};

const handleFileUpload = (file: File): void => {
  if (!validateFileType(file)) {
    handleUploadError(ErrorMessages.InvalidFormat);
    return;
  }
  if (file.size > props.maxFileSize) {
    handleUploadError(ErrorMessages.MaxSizeExceeded);
    return;
  }
  isError.value = false;
  startUpload(file);
};

const handleUploadError = (error: ErrorMessages): void => {
  isError.value = true;
  hintText.value = props.hintText[error];
};

const startUpload = (file: File): void => {
  isUploading.value = true;
  fileName.value = file.name;
  hintText.value = props.hintText.default;
  emits('fileUploaded', file);
  setTimeout(() => {
    isUploading.value = false;
  }, 2000);
};

const cancelUpload = (): void => {
  isUploading.value = false;
  fileName.value = '';
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
  emits('fileUploaded', null);
};

const deleteFile = (): void => {
  isUploading.value = false;
  fileName.value = '';
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
  emits('fileUploaded', null);
};

const buttonLabel = computed(() => {
  if (isUploading.value) {
    return props.buttonStates.upload;
  } else if (fileName.value) {
    return props.buttonStates.delete;
  } else {
    return props.buttonStates.default;
  }
});

const validateFileType = (file: File): boolean => {
  return file.type.startsWith(props.fileType);
};

const getDefaultFileName = (): string => {
  return isUploading.value ? fileName.value : (fileName.value ? fileName.value : props.defaultText);
};
</script>

<style lang="scss">
.ui-file-input {
  display: inline-flex;
  flex-direction: column;
  position: relative;

  &__title {
    color: var(--label-color);
    font-weight: 500;
    font-size: 13px;
    margin-bottom: 12px;
  }

  &__body {
    position: relative;
  }

  &__button {
    position: relative;
    z-index: 1;
    margin-right: 16px;
  }

  &__input {
    position: absolute;
    visibility: hidden;
    z-index: 2;
  }

  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &__text {
    display: inline-flex;
    align-items: center;
    font-size: 14px;
    color: var(--text-color);

    &--is-upload {
      color: var(--hint-text-color);
    }
  }

  &__text svg {
    animation: rotate 2s linear infinite;
    margin-right: 8px;
  }

  &__hint-text {
    margin-top: 8px;
    font-size: 13px;
    color: var(--hint-text-color);

    &--is-error {
      color: var(--error-color);
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
}
</style>