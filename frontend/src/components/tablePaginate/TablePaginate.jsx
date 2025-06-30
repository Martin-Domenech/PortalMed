import React from "react"
import './TablePaginate.css'
import { useEffect, useState } from "react"
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Button } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_PORTALMED
function PaginateTable({ patients, setPatients, page, setPage, search, setSearch, hideEmail }) {

  const rowsPerPage = 10
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteID, setDeleteID] = useState("")
  const [open, setOpen] = useState(false)

  const navigate = useNavigate();

  const handleClickOpen = (id) => {
    setDeleteID(id)
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearch(encodeURIComponent(searchTerm))
    setPage(1)
  }

  if (!patients || !patients.docs || !Array.isArray(patients.docs)) {
    return <div>No hay pacientes disponibles.</div>
  }

  const handleChange = (event, value) => {
    setPage(value)
  }
  const emptyRows = rowsPerPage - patients.docs.length

  const handleClickDetail = (id) => {
    navigate(`/patient-detail/${id}`)
  }

  const deletePatient = async () => {

    try {
      const response = await fetch(`${API_URL}/api/patients/delete/${deleteID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        const errorMessage = await response.json(); 
        throw new Error(`Error: ${errorMessage}`);
      }
      setPatients(prev => ({
        ...prev,
        docs: prev.docs.filter(p => p._id !== deleteID)
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
      setDeleteID("");
    }
  }

  const updatePatientNavigate =  (id) => {
    navigate(`/update-patient/${id}`)
  }

  return (
    <section className="paginatedTable">
      <div>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
          <OutlinedInput
            placeholder="Buscar Paciente"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              backgroundColor: 'white',
              borderColor: 'black',
              borderRadius: '2px',
              height: '30px',
              marginBottom: '10px',
              width: '250px',
              marginRight: '5px'
            }}
          />
          <Button 
            variant="contained" 
            type="submit" 
            sx={{
              backgroundColor: '#78D8AE',
              color: 'black',
              height: '30px', 
              width: '30px',
              marginBottom: '10px',
              '&:hover': {
                backgroundColor: '#5ac097', 
              }
            }}
          >
            <SearchIcon />
          </Button>
        </form>
        <TableContainer component={Paper} sx={{ boxShadow: 'none', p: 0, maxWidth: '100%', border: '1px solid black' }}>
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: '#7BD9B1' }}>
              <TableRow >
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', borderBottom: '1px solid black' }}>Nombre</TableCell>
                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '1rem', borderBottom: '1px solid black' }}>DNI</TableCell>
                {!hideEmail && (
                  <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1rem', borderBottom: '1px solid black' }}>Email</TableCell>
                )}
                <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '1rem', borderBottom: '1px solid black' }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.docs.map((p, index) => (
                <TableRow
                  key={p._id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    backgroundColor: index % 2 === 0 ? '#f7f7f7' : '#e0e0e0',
                    '&:hover': { backgroundColor: '#d0d0d0' },
                    minHeight: '48px',
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ fontSize: '0.95rem' }}>
                    <Typography
                      onClick={() => handleClickDetail(p._id)}
                      className="nombre-paciente"
                      sx={{
                        cursor: 'pointer',          
                        color: 'black',  
                        fontWeight: 'bold',           
                        '&:hover': {
                          color: 'blue',            
                        },
                      }}
                    >
                      {`${p.first_name} ${p.last_name}`}
                    </Typography>
                  </TableCell>
                  <TableCell align="left" sx={{ fontSize: '0.95rem' }}>{p.dni}</TableCell>
                  {!hideEmail && (
                    <TableCell align="center" sx={{ fontSize: '0.95rem' }}>
                      {p.email ? p.email : '-'}
                    </TableCell>
                  )}

                  <TableCell align="right" sx={{ fontSize: '0.95rem', paddingRight: '20px' }}>
                    <button className="icon-btn-table" style={{ marginRight: '10px' }} onClick={() => updatePatientNavigate(p._id)} ><EditIcon sx={{fontSize: '1.2rem' }}/></button>
                    <button className="icon-btn-table" onClick={() => handleClickOpen(p._id)}>
                      <DeleteForeverIcon sx={{fontSize: '1.2rem' }}/>
                      </button>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        TransitionProps={{
                          onEntering: () => {
                            setTimeout(() => {
                              const dialog = document.querySelector('[role="dialog"]')
                              if (dialog) {
                                dialog.removeAttribute('aria-hidden') 
                                dialog.focus(); 
                              }
                            }, 200)
                          }
                        }}
                      >
                        <DialogTitle id="alert-dialog-title">
                          {`Seguro que desea eliminar al paciente?`}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Si elimina este paciente, se perderán todos sus datos personales y sus evoluciones clínicas.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button 
                            onClick={handleClose} 
                            variant="outlined" 
                            sx={{
                              color: 'gray',
                              borderColor: 'gray',
                              '&:hover': {
                                backgroundColor: '#f0f0f0',
                                borderColor: 'gray',
                              }
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button 
                            onClick={deletePatient} 
                            variant="contained" 
                            autoFocus
                            sx={{
                              backgroundColor: '#d32f2f',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: '#b71c1c',
                              }
                            }}
                          >
                            Eliminar
                          </Button>
                        </DialogActions>
                      </Dialog>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack spacing={2} className="paginated" >
          <Pagination 
            count={patients.totalPages}      
            page={page}              
            onChange={handleChange}  
            variant="outlined" 
            shape="rounded" 
            sx={{
              display: 'flex',
              justifyContent: 'end',
              marginTop: '10px',
              '& .MuiPaginationItem-root': { 
                color: 'black',      
                bgcolor: 'grey',
                '&.Mui-selected': {
                  bgcolor: '#78D8AE',   
                  color: 'black',            
                },
              },
            }} 
          />
        </Stack>
      </div>
    </section>
  )
}

export default PaginateTable
