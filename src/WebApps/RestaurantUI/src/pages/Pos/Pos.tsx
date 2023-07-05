import { useEffect, useState } from "react";
import "./Pos.css";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Tab,
  Tabs,
  tabsClasses,
} from "@mui/material";

import React from "react";
import categoryService from "@/core/services/category.service";
import { Category, Product } from "@/core/models";
import { productService } from "@/core/services";

import ProductSearch from "./components/ProductSearch";
import CustomerSearch from "./components/CustomerSearch";
import ProductSelected from "./components/ProductSelected";

interface PosSate {
  categories: Array<Category>;
  products: Array<Product>;
}

export default function Pos() {
  const [categories, setCategories] = useState<PosSate["categories"]>([]);
  const [products, setProducts] = useState<PosSate["products"]>([]);

  const [activeProductIds, setActiveProductIds] = useState<number[]>([]);

  const handleToggleClass = (productId: number) => {
    if (activeProductIds.includes(productId)) {
      setActiveProductIds(activeProductIds.filter((id) => id !== productId));
    } else {
      setActiveProductIds([...activeProductIds, productId]);
    }
  };
  // const [isClassActive, setIsClassActive] = useState(false);
  // const [value, setValue] = React.useState(0);

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: number
  ) => {
    console.log(categories[newValue]);
    console.log(event.target);
    setSelectedTab(newValue);
    getProductsByCategoryId(categories[newValue].id);
  };

  // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setValue(newValue);
  // };

  // const handleToggleClass = () => {
  //   setIsClassActive((prevState) => !prevState);
  // };
  const getProductsByCategoryId = (categoryId: number) => {
    productService.getProducts(categoryId).then((response) => {
      console.log(response);
      setProducts(response);
    });
  };
  const getCateries = () => {
    categoryService.getAll().then((response) => {
      setCategories(response);
    });
  };

  useEffect(() => {
    getCateries();
  }, []);

  return (
    <>
      <div className="row page-titles">
        <div className="col-md-5 align-self-center">
          <h4 className="text-themecolor">Pos</h4>
        </div>
        <div className="col-md-7 align-self-center text-end">
          <div className="d-flex justify-content-end align-items-center">
            {/* <ol className="breadcrumb justify-content-end">
              <li className="breadcrumb-item">
                <a href="#">Home</a>
              </li>
              <li className="breadcrumb-item active">Calendar</li>
            </ol>
            <button
              type="button"
              className="btn btn-info d-none d-lg-block m-l-15 text-white"
            >
              <i className="fa fa-plus-circle"></i> Create New
            </button> */}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-7">
          <Box
            sx={{
              flexGrow: 1,

              bgcolor: "background.paper",
            }}
          >
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons
              aria-label="visible arrows tabs example"
              sx={{
                [`& .${tabsClasses.scrollButtons}`]: {
                  "&.Mui-disabled": { opacity: 0.3 },
                },
              }}
            >
              {categories.map((item, index) => (
                <Tab
                  key={index}
                  label={item.name}
                  icon={
                    <Avatar sx={{ width: 24, height: 24 }} src={item.image} />
                  }
                />
              ))}
            </Tabs>
            <Box sx={{ p: 2 }}>
              <ProductSearch />
              <div className="product-list">
                <Grid container spacing={3}>
                  {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <div
                        className={`product ${
                          activeProductIds.includes(product.id) ? "active" : ""
                        }`}
                        onClick={() => handleToggleClass(product.id)}
                      >
                        <img src={product.images[0]} alt="" />
                        <h5>{product.title}</h5>
                        <h6>$ {product.price}</h6>
                        {activeProductIds.includes(product.id) && (
                          <div className="overlay">
                            <i className="fa fa-check-circle"></i>
                          </div>
                        )}
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </Box>
          </Box>
        </div>

        <div className="col-md-5">
          <Box
            sx={{
              flexGrow: 1,

              bgcolor: "background.paper",
            }}
          >
            <Card>
              <CardContent>
                <CustomerSearch />
                <Divider sx={{ py: 2 }}>
                  <Chip label="ITEMS" />
                </Divider>
                <ProductSelected />

                <hr />
                <table className="amount-table">
                  <tr>
                    <td>Subtotal</td>
                    <td className="text-right">
                      <b>$0.00</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Discount (<b>0.00</b> %)
                    </td>
                    <td className="text-right">
                      <b>$0.00</b>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Tax (<b>6.00</b> %)
                    </td>
                    <td className="text-right">
                      <b>$0.00</b>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-weight-bold">Grand Total</td>
                    <td className="text-right">
                      <b>$0.00</b>
                    </td>
                  </tr>
                </table>
                <Button variant="contained" size="large" fullWidth>
                  Large
                </Button>
              </CardContent>
            </Card>
          </Box>
        </div>
      </div>
    </>
  );
}
