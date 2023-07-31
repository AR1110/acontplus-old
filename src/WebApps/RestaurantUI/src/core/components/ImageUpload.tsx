import { Card, CardActionArea, CardActions, CardMedia, IconButton } from "@mui/material"
import { ChangeEvent, useRef, useState } from "react"
import ImgProductDefault from '/assets/images/imgProductDefault.png';
import { RemoveCircleOutlineIcon } from ".";

type ImageUploadProps = {
    onChangeImage: (image: File | null) => void
}
function ImageUpload({ onChangeImage }: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleUploadButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Read the selected file as a data URL and set it as the image preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
        onChangeImage(selectedFile as File)
    };

    const handleFileRemove = function () {
        onChangeImage(null)
        setSelectedImage(null);
    }

    const handleToUpperCase = function () {
        if(!formik.values.descripcion) return null;
    }

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea onClick={handleUploadButtonClick}>
                {selectedImage ? (
                    <CardMedia
                        component="img"
                        height="140"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                        image={selectedImage}
                        alt="green iguana"
                    />

                ) : <CardMedia
                    component="img"
                    height="140"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                    image={ImgProductDefault}
                    alt="green iguana"
                />
                }

                <input
                    type="file"
                    accept=".png, .jpg, .jpeg, .webp"
                    style={{ display: 'none' }} // Oculta el input file
                    ref={fileInputRef} // Asigna la referencia
                    onChange={handleFileChange}
                />
            </CardActionArea>
            <CardActions>
                <IconButton aria-label="fingerprint" color="error" onClick={handleFileRemove}>
                    <RemoveCircleOutlineIcon />
                </IconButton>
            </CardActions>
        </Card>
    )
}


export {
    ImageUpload
}