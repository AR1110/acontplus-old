export default function toast({
    type,
    message,
    title = null,
    positionClass = null,
    timeOut = null,
    extendedTimeOut = null
}) {
    return toastr[type](message, title, {
        closeButton: true,
        debug: false,
        newestOnTop: true,
        progressBar: true,
        positionClass: positionClass || 'toast-bottom-center',
        preventDuplicates: true,
        timeOut: timeOut || 5000,
        extendedTimeOut: extendedTimeOut || 1000
    })
}