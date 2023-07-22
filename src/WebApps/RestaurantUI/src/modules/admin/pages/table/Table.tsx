import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, ButtonGroup, Grid, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import { useEffect, useState } from "react";
import { tableSvc } from "@admin/services";
import TableDialog from "./components/TableDialog";
import { ITable, TablesResponseFromApi } from "@admin/models/table.model";

export default function TableIndex() {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [tables, setTables] = useState<Array<ITable>>([]);
  const [data, setData] = useState<Partial<ITable>>({
    id: 0,
    numberTable: 1,
    description: "",
    capacity: 1,
  });

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const handleConfirmSave = () => {
    console.log("saved");
  };

  const handleSetDataEdit = (row: ITable) => {
    setData(row);
    setIsOpenDialog(true);
  };

  const mapFromApiToTables = (
    apiResponse: TablesResponseFromApi
  ): Array<ITable> => {
    return apiResponse.map((table) => ({
      id: table.id,
      numberTable: table.numberTable,
      description: table.description,
      capacity: table.capacity,
    }));
  };

  const getTables = () => {
    try {
      tableSvc.getAll("{}").then((response) => {
        if (response.code === "0") {
          console.log(response);
        }
        if (response.code === "1") {
          const tables = mapFromApiToTables(JSON.parse(response.payload));
          console.log(tables);
          setTables(tables);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTables();
  }, []);

  let indexRow = 1;
  return (
    <>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <div></div>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Agregar
            </Button>
          </Stack>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Op.</TableCell>
                <TableCell align="center">N°</TableCell>
                <TableCell align="center">Descripción</TableCell>
                <TableCell align="center">Número mesa</TableCell>
                <TableCell align="center">Capacidad</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tables.map((row, index) => {
                return (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">
                      <ButtonGroup
                        variant="contained"
                        aria-label="outlined primary button group"
                        size="small"
                      >
                        <Button color="error">
                          <DeleteOutlineIcon fontSize="small" />
                        </Button>
                        <Button onClick={() => handleSetDataEdit(row)}>
                          <ModeEditOutlineIcon fontSize="small" />
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                    <TableCell align="center">{indexRow++}</TableCell>
                    <TableCell align="center">{row.description}</TableCell>
                    <TableCell align="center">{row.numberTable}</TableCell>
                    <TableCell align="center">{row.capacity}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
      <TableDialog
        isOpenDialog={isOpenDialog}
        handleClose={handleCloseDialog}
        handleConfirmSave={handleConfirmSave}
        values={data}
      />
    </>
  );
}
