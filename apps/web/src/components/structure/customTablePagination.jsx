import TablePagination from "@mui/material/TablePagination";

const CustomTablePagination = ({
  rowsPerPage,
  page,
  totalItems,
  onChangePage,
  onChangeRowsPerPage,
}) => {
  return (
    <TablePagination
      component="div"
      count={totalItems}
      page={page}
      onPageChange={(event, newPage) => {
        onChangePage(newPage);
      }}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={(event) => {
        onChangeRowsPerPage(event.target.value);
      }}
    />
  );
};

export default CustomTablePagination;
