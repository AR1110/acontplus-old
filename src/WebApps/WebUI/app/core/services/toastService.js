import app from '@src/app';
app.factory("toastService", toastService)
    
    function toastService() {
    return {
        toastr: function (...rest) {
            let obj = {
                type: "warning",
                message: "",
                title: "",
                timeOut: null,
                extendedTimeOut: null,
                positionClass: null,
            };
            if (rest.length > 0) {
                const [
                    optionsOrType,
                    message,
                    title,
                    positionClass,
                    timeOut,
                    extendedTimeOut,
                ] = rest;

                if (optionsOrType !== null && typeof optionsOrType === "object") {
                    obj.type = optionsOrType.type;
                    obj.message = optionsOrType.message;
                    obj.title = optionsOrType.title;
                    obj.timeOut = optionsOrType.timeOut;
                    obj.extendedTimeOut = optionsOrType.extendedTimeOut;
                    obj.positionClass = optionsOrType.positionClass;
                } else {
                    obj.type = optionsOrType;
                    obj.message = message;
                    obj.title = title;
                    obj.timeOut = timeOut;
                    obj.extendedTimeOut = extendedTimeOut;
                    obj.positionClass = positionClass;
                }
            }

            toastr[obj.type](obj.message, obj.title, {
                closeButton: true,
                debug: false,
                newestOnTop: true,
                progressBar: true,
                positionClass: obj.positionClass || "toast-bottom-center",
                preventDuplicates: true,
                timeOut: obj.timeOut || 5000,
                extendedTimeOut: obj.extendedTimeOut || 1500,
            });
        },
    };
}