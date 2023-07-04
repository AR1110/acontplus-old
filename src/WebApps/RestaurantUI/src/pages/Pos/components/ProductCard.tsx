import React from "react";

import { Product } from "@/core/models";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelectionChange: (productId: number, isSelected: boolean) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onSelectionChange,
}) => {
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelectionChange(product.id, event.target.checked);
  };
  console.log(handleCheckboxChange, isSelected);

  return (
    <Card>
      <CardMedia
        component="img"
        alt={product.title}
        height="200"
        image={product.images[0]}
      />
      <CardContent>
        <Typography variant="h5" component="h2">
          {product.title}
        </Typography>
        <Typography color="textSecondary">Price: {product.price}</Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
