import Layout from '../components/layout';
import MenuBar from '../components/menubar';
import EntryField from '../components/fields/EntryField';
import InjectionPointForm from '../components/fields/injection_points/InjectionPointForm';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';

import { ReactNode, useState } from 'react';
import { usePressureTestsByIdQuery, useValidatorsPressureTestQuery, useAddPressureTestMutation, useDeletePressureTestMutation, PressureTestsByIdDocument } from '../graphql/generated/graphql';
// import { IInferFromArray } from '../components/fields/injection_points/InjectionPoints';

// type IPressureTest = NonNullable<IInferFromArray<PressureTestsByIdQuery['pressureTestsById']>>;

export interface IPressureTestsProps {
  id?: string;
  in_tab_panel?: boolean;
}

export default function PressureTests({ id, in_tab_panel }: IPressureTestsProps) {

  const { data, loading, error } = usePressureTestsByIdQuery({ variables: { pipelineId: id } });
  const { data: dataValidatorsPressureTest } = useValidatorsPressureTestQuery();

  const [addPressureTest, { data: dataAddPressureTest }] = useAddPressureTestMutation({ refetchQueries: [PressureTestsByIdDocument, 'pressureTestsById'] });
  const [deletePressureTest, { data: dataDeletePressureTest }] = useDeletePressureTestMutation({ refetchQueries: [PressureTestsByIdDocument, 'pressureTestsById'] })

  const [showAddForm, setShowAddForm] = useState(false);

  // function renderRow({ id, pipeline, limitingSpec, infoSentOutDate, ddsDate, pressureTestDate, pressureTestReceivedDate, integritySheetUpdated, comment }: IPressureTest) {
  //   return (
  //     <TableRow hover role="checkbox" tabIndex={-1} key={id}>
  //       <TableCell />
  //       {in_tab_panel ? null : <TableCell>{`${pipeline.license}-${pipeline.segment}`}</TableCell>}
  //       <EntryField table="pressureTest" id={id} record={limitingSpec} columnName="limitingSpec" validator={dataValidatorsPressureTest?.validators?.limitingSpecEnum} />
  //       <EntryField table="pressureTest" id={id} record={infoSentOutDate} columnName="infoSentOutDate" validator="date" />
  //       <EntryField table="pressureTest" id={id} record={ddsDate} columnName="ddsDate" validator="date" />
  //       <EntryField table="pressureTest" id={id} record={pressureTestDate} columnName="pressureTestDate" validator="date" />
  //       <EntryField table="pressureTest" id={id} record={pressureTestReceivedDate} columnName="pressureTestReceivedDate" validator="date" />
  //       <EntryField table="pressureTest" id={id} record={integritySheetUpdated} columnName="integritySheetUpdated" validator="date" />
  //       <EntryField table="pressureTest" id={id} record={comment} columnName="comment" validator={dataValidatorsPressureTest?.validators?.anyTextMatchPattern} />
  //     </TableRow>
  //   )
  // }

  // This function needs to match handleSubmit function signature from InjectionPointForm component because we are using
  // `upstream pipeline form` to return all pipelines in autocomplete dropdown.
  function handleSubmitPressureTestFrom(_injectionPointType: string, pipelineId: string) {
    addPressureTest({ variables: { pipelineId } });
    setShowAddForm(false);
  }

  function handleAddPressureTest() {
    if (in_tab_panel === true && id) {
      addPressureTest({ variables: { pipelineId: id } });
    } else {
      setShowAddForm(!showAddForm);
    }
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 64px)' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>
                <IconButton aria-label="add row" size="small" onClick={handleAddPressureTest}>
                  {showAddForm ? <BlockOutlinedIcon /> : <AddCircleOutlineOutlinedIcon />}
                </IconButton>
              </TableCell>
              {in_tab_panel ? null : <TableCell>Pipeline</TableCell>}
              <TableCell align="right">Limiting Spec</TableCell>
              <TableCell align="right">Info Sent Out</TableCell>
              <TableCell align="right">DDS Date</TableCell>
              <TableCell align="right">Pressure Test Date</TableCell>
              <TableCell align="right">Pressure Test Received Date</TableCell>
              <TableCell align="right">Integriry Sheet Updated Date</TableCell>
              <TableCell align="right">Comment</TableCell>
              <TableCell align="right">Created By</TableCell>
              <TableCell align="right">ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {showAddForm ? <TableRow>
              <TableCell colSpan={4}>
                <InjectionPointForm
                  injectionPointType="upstream pipeline"
                  handleSubmit={handleSubmitPressureTestFrom}
                />
              </TableCell>
            </TableRow> : null}
            {loading ? <TableRow><TableCell>Loading...</TableCell></TableRow> :
              error ? <TableRow><TableCell>{error.message}</TableCell></TableRow> :
                data && data.pressureTestsById ?
                  data.pressureTestsById.map(pressureTest => {
                    return pressureTest ?
                      (
                        <TableRow hover role="checkbox" tabIndex={-1} key={pressureTest.id}>
                          <TableCell>
                            <IconButton aria-label="delete row" size="small" onClick={() => deletePressureTest({ variables: { id: pressureTest.id } })}>
                              <DeleteOutlineOutlinedIcon />
                            </IconButton>
                          </TableCell>
                          {in_tab_panel ? null : <TableCell>{`${pressureTest.pipeline.license}-${pressureTest.pipeline.segment}`}</TableCell>}
                          <EntryField table="pressureTest" id={pressureTest.id} record={pressureTest.limitingSpec} columnName="limitingSpec" validator={dataValidatorsPressureTest?.validators?.limitingSpecEnum} />
                          <EntryField table="pressureTest" id={pressureTest.id} record={pressureTest.infoSentOutDate} columnName="infoSentOutDate" validator="date" />
                          <EntryField table="pressureTest" id={pressureTest.id} record={pressureTest.ddsDate} columnName="ddsDate" validator="date" />
                          <EntryField table="pressureTest" id={pressureTest.id} record={pressureTest.pressureTestDate} columnName="pressureTestDate" validator="date" />
                          <EntryField table="pressureTest" id={pressureTest.id} record={pressureTest.pressureTestReceivedDate} columnName="pressureTestReceivedDate" validator="date" />
                          <EntryField table="pressureTest" id={pressureTest.id} record={pressureTest.integritySheetUpdated} columnName="integritySheetUpdated" validator="date" />
                          <EntryField table="pressureTest" id={pressureTest.id} record={pressureTest.comment} columnName="comment" validator={dataValidatorsPressureTest?.validators?.anyTextMatchPattern} />
                          <TableCell align="right">{pressureTest.createdBy.email}</TableCell>
                          <TableCell align="right">{pressureTest.id}</TableCell>
                        </TableRow>
                      ) : null
                  }) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}


PressureTests.getLayout = function getLayout(page: ReactNode) {

  return (
    <Layout>
      <MenuBar />
      {page}
    </Layout>
  )
}