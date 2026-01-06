import {toast} from "react-toastify";

const toastConfig = {
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
}

export const showSuccess = (message: string) : void => {
    toast.success(message, toastConfig);
}

export const showError = (message: string) : void => {
    toast.error(message, toastConfig);
}
