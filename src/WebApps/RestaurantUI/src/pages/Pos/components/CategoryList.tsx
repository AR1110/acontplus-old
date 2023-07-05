import React, { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";

type TabItem = {
  label: string;
  content: JSX.Element;
};

type TabListProps = {
  items: TabItem[];
};

const CategoryList: React.FC<TabListProps> = ({ items }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    newValue: number
  ) => {
    console.log(event);
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        {items.map((item, index) => (
          <Tab key={index} label={item.label} />
        ))}
      </Tabs>
      {/* Content for each tab */}
      {items.map((item, index) => (
        <Box
          key={index}
          role="tabpanel"
          hidden={selectedTab !== index}
          sx={{ display: selectedTab === index ? "block" : "none" }}
        >
          {item.content}
        </Box>
      ))}
    </Box>
  );
};

export default CategoryList;
