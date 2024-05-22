import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { Tag } from 'antd';

import { DatePicker, Space, Typography } from 'antd';
import type { DatePickerProps } from 'antd';

const { RangePicker } = DatePicker;

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import "../../ag-grid-theme-builder.css";
import { load } from './loadTableData.telefunc';
import useQuery from '../../hooks/useQuery';
import { ErrorBound } from '../../components/ErrorBound';
import { Dayjs } from 'dayjs';

export { Page };

const { TextArea } = Input;

const Form: React.FC = () => {
  const [keywords, setKeywords] = useState('')
  const [dates, setDates] = useState<Dayjs[]>([])
  const gridRef = useRef<AgGridReact>(null);

  const { data, isRefetching, refetch } = useQuery(load, {})

  const search = () => {
    refetch({
      dates: dates.map(d => d.toISOString()),
      keywords: keywords.split(','),
    })
  }

  useEffect(() => {
    const bigSix = [
      'Deloitte',
      'EY',
      'Grant Thornton',
      'Plante Moran',
      'PwC',
      'Rehmann',
    ];
    if (!isRefetching && data) {
      colDefs.find((def) => {
        if (def.field === 'company') {
          def.filterParams.filterOptions.push({
            displayKey: 'no_big6',
            displayName: 'No Big 6',
            predicate: (filterValues: any[], cellValue: any) => {
              return !bigSix.includes(cellValue);
            },
            numberOfInputs: 0,
          })
        }
      })
    }
  }, [isRefetching])

  const onBtnExport = useCallback(() => {
    gridRef.current!.api.exportDataAsCsv();
  }, []);

  // Row Data: The data to be displayed.
  const rowData = data.rowData;
  // Column Definitions: Defines the columns to be displayed.
  const colDefs = data.colDefs;

  return (
    <>
      <Space direction="vertical" className='w-full'>
        <Space direction="vertical" className='w-full'>
          <Typography.Title level={3}>Contain any keywords in credited course titles</Typography.Title>
          <TextArea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value || '')}
            rows={4}
            placeholder="Paste comma separate keywords. e.g. Corporate Finance,Leadership,Short-Term Rental"
          />
          <Typography.Title level={5}>Preview parsed result to send to DB</Typography.Title>
          <div>
            {keywords.split(',').map((keyword) => {
              return (
                <Tag>{keyword || 'IGNORE: Empty Keyword'}</Tag>
              )
            })}
          </div>
        </Space>
        <Space direction="vertical" className='w-full'>
          <Typography.Title level={3}>Credited period</Typography.Title>
          <RangePicker value={dates} onChange={(dates) => setDates(dates)} picker="month" />
        </Space>
        <Button type="primary" icon={<SearchOutlined />} onClick={search}>
          Search
        </Button>
        <Typography.Title level={5}>Search keywords or dates to display ALL results, otherwise it is limited to 20000 rows</Typography.Title>
      </Space>
      <div style={{ margin: "10px 0" }} className="flex justify-end">
        <Button onClick={onBtnExport}>Download CSV export file</Button>
      </div>
      <div
        className="mt-4 ag-theme-quartz" // applying the grid theme
        style={{ height: 500 }} // the grid will fill the size of the parent container
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          pagination={true}
        />
      </div>
    </>
  )
};

const Page: React.FC = () => {
  return (
    <div className="p-4">
      <ErrorBound>
        <Form />
      </ErrorBound>
    </div>
  )
};
