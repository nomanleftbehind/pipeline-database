import { useState } from 'react';
import RecordEntry, { IEditRecord } from '../fields/RecordEntry';
import { ModalFieldError } from '../Modal';
import PipelineData from './PipelineData';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { useEditPipelineMutation, useDeletePipelineMutation, PipelinesByIdDocument, useDuplicatePipelineMutation, PipelinesByIdQuery, GetValidatorsQuery, ValidatorsPipelineQuery, RiskByIdDocument } from '../../graphql/generated/graphql';
import { IRecordEntryMap } from './LicenseChanges';

export type IInferFromArray<T> = T extends (infer U)[] ? NonNullable<U> : never;

export type IPipeline = IInferFromArray<NonNullable<PipelinesByIdQuery['pipelinesById']['pipelines']>>;
export type IValidators = GetValidatorsQuery['validators'];

type IValidatorsPipeline = ValidatorsPipelineQuery['validators'];

type IFieldError = {
  field: string;
  message: string;
}

export const openModal = ({ field, message }: IFieldError) => {
  return field !== '' && message !== '';
}

interface IRenderPipelineProps {
  gridRow: number;
  rowIsEven: boolean;
  pipeline: IPipeline;
  validators: IValidatorsPipeline;
}

const isEven = (value: number) => {
  if (value % 2 === 0)
    return 'even';
  else return 'odd';
}

export default function RenderPipeline({ gridRow, rowIsEven, pipeline, validators }: IRenderPipelineProps) {

  const [open, setOpen] = useState(false);
  const initialFieldError = { field: '', message: '' };
  const [fieldError, setFieldError] = useState(initialFieldError);
  const [confirmDeletePipelineModal, setConfirmDeletePipelineModal] = useState(false);

  const [editPipeline] = useEditPipelineMutation({
    refetchQueries: [PipelinesByIdDocument, 'PipelinesById', RiskByIdDocument, 'RiskById'],
    onCompleted: ({ editPipeline }) => {
      const { error } = editPipeline || {};
      if (error) {
        setFieldError(error);
      }
    }
  });
  const [deletePipeline] = useDeletePipelineMutation({
    variables: { id: pipeline.id },
    refetchQueries: [PipelinesByIdDocument, 'PipelinesById'],
    onCompleted: ({ deletePipeline }) => {
      const { error } = deletePipeline || {};
      if (error) {
        setFieldError(error);
      }
    }
  });
  const [duplicatePipeline] = useDuplicatePipelineMutation({
    variables: { id: pipeline.id },
    refetchQueries: [PipelinesByIdDocument, 'PipelinesById'],
    onCompleted: ({ duplicatePipeline }) => {
      const { error } = duplicatePipeline || {};
      if (error) {
        setFieldError(error);
      }
    }
  });


  const editRecord = ({ id, columnName, columnType, newRecord }: IEditRecord) => {
    const switchNewRecord = () => {
      switch (columnType) {
        case 'number':
          if (newRecord === null) {
            return null;
          }
          return Number(newRecord);
        case 'date':
          if (newRecord && typeof newRecord !== 'boolean') {
            const date = new Date(newRecord);
            return date.toISOString();
          }
        case 'boolean':
          if (newRecord === 'true') {
            return true;
          }
          if (newRecord === 'false') {
            return false;
          }
        default:
          return newRecord;
      }
    }
    newRecord = switchNewRecord();
    editPipeline({ variables: { id, [columnName]: newRecord } });
  }

  const deleteRecord = () => {
    setConfirmDeletePipelineModal(false);
    deletePipeline();
  }

  const hideFieldErrorModal = () => {
    setFieldError(initialFieldError);
  }

  const isModalOpen = openModal(fieldError);

  const { id, license, segment, from, fromFeature, to, toFeature, currentStatus, currentSubstance, authorized } = pipeline;
  const { licenseMatchPattern, segmentMatchPattern, fromToMatchPattern, fromToFeatureEnum, statusEnum, substanceEnum } = validators || {};

  const pipelineColumns: IRecordEntryMap[] = [
    { columnName: 'license', columnType: 'string', nullable: false, record: license, validator: licenseMatchPattern, editRecord },
    { columnName: 'segment', columnType: 'string', nullable: false, record: segment, validator: segmentMatchPattern, editRecord },
    { columnName: 'from', columnType: 'string', nullable: false, record: from, validator: fromToMatchPattern, editRecord },
    { columnName: 'fromFeature', columnType: 'string', nullable: true, record: fromFeature, validator: fromToFeatureEnum, editRecord },
    { columnName: 'to', columnType: 'string', nullable: false, record: to, validator: fromToMatchPattern, editRecord },
    { columnName: 'toFeature', columnType: 'string', nullable: true, record: toFeature, validator: fromToFeatureEnum, editRecord },
    { columnName: 'currentStatus', columnType: 'string', nullable: false, record: currentStatus, validator: statusEnum },
    { columnName: 'currentSubstance', columnType: 'string', nullable: false, record: currentSubstance, validator: substanceEnum },
  ];

  const backgroundColor = rowIsEven ? '#abeaff' : undefined;

  return (
    <>
      {confirmDeletePipelineModal && <ModalFieldError
        fieldError={{ field: 'Pipeline', message: `Are you sure you want to delete pipeline ${license}-${segment}?` }}
        hideFieldError={() => setConfirmDeletePipelineModal(false)}
        executeFunction={deleteRecord}
      />}
      <div className='pipeline-row' style={{ gridColumn: 1, gridRow, backgroundColor }}>
        <IconButton className='button-container' aria-label='expand row' size='small' title={open ? 'Collapse pipeline row' : 'Expand pipeline row'} onClick={() => setOpen(!open)}>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </div>
      <div className='pipeline-row' style={{ gridColumn: 2, gridRow, backgroundColor }}>
        {<IconButton className='button-container' aria-label='delete row' size='small' title='Delete pipeline' disabled={!authorized} onClick={() => setConfirmDeletePipelineModal(true)}>
          <DeleteOutlineOutlinedIcon />
        </IconButton>}
      </div>
      <div className='pipeline-row' style={{ gridColumn: 3, gridRow, backgroundColor }}>
        {<IconButton className='button-container' aria-label='add row' size='small' title='Create a copy of pipeline' disabled={!authorized} onClick={() => duplicatePipeline()}>
          <AddCircleOutlineOutlinedIcon />
        </IconButton>}
      </div>
      {isModalOpen && <ModalFieldError
        fieldError={fieldError}
        hideFieldError={hideFieldErrorModal}
      />}
      {pipelineColumns.map(({ columnName, columnType, nullable, record, validator, editRecord }, gridColumn) => {
        gridColumn += 4;
        return (
          <div key={gridColumn} className='pipeline-row' style={{ gridColumn, gridRow, backgroundColor }}>
            <RecordEntry id={id} columnName={columnName} columnType={columnType} nullable={nullable} record={record} validator={validator} authorized={authorized} editRecord={editRecord} />
          </div>
        );
      })}
      <div className='pipeline-row' style={{ gridColumn: 12, gridRow, backgroundColor }}></div>
      <PipelineData
        key={`${id} data`}
        gridRow={gridRow}
        rowIsEven={rowIsEven}
        open={open}
        pipeline={pipeline}
        authorized={authorized}
        editPipeline={editRecord}
      />
    </>
  );
}