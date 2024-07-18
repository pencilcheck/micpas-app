import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Segmented, Spin, Tag } from 'antd';
import _ from 'lodash';
import compact from 'lodash/compact';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { DatePicker, Space, Typography } from 'antd';

const { RangePicker } = DatePicker;

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component

import 'ag-grid-enterprise';

import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

import "./index.css";

import "../../ag-grid-theme-builder.css";

import { Dayjs } from 'dayjs';
import { ErrorBound } from '../../components/ErrorBound';
import useQuery from '../../hooks/useQuery';
import { load } from './loadTableData.telefunc';
import { PieChart } from '../../components/PieChart';
import { isWhat } from '../../helpers/isGen';
import { ITooltipParams } from 'ag-grid-community';

export { Page };

const { TextArea } = Input;

const Form: React.FC = () => {
  const [pieData, setPieData] = useState();
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState('')
  const [dates, setDates] = useState<Dayjs[]>([])
  const gridRef = useRef<AgGridReact>(null);
  const options = ['Both', '3rd Party', 'No 3rd Party'];
  const [value, setValue] = useState<string | number>('Both');

  const { data, isRefetching, refetch } = useQuery(load, {})

  // Row Data: The data to be displayed.
  const rowData = data.rowData;
  // Column Definitions: Defines the columns to be displayed.
  const colDefs = data.colDefs;

  const defaultColDef = {
    // remove advanced features, enable only if it is requested
    suppressHeaderMenuButton: true,
    suppressHeaderContextMenu: true,

    autoHeight: true,
    wrapText: true,
  }

  const search = async () => {
    setLoading(true);
    await refetch({
      source: value,
      dates: dates.map(d => d.toISOString()),
      keywords: compact(keywords.split(',')),
    });
    setLoading(false);
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
      colDefs.forEach((def) => {
        // filters[1] is agSetColumnFilter, see telefunc
        def.filterParams.filters[1].filterParams = {
          valueFormatter: param => {
            return String(param.value)
          }
        }
      });

      colDefs.find((def) => {
        if (def.field === 'company') {
          def.filterParams.filters.find(d => d.filter === 'agTextColumnFilter').filterParams.filterOptions.push({
            displayKey: 'no_big6',
            displayName: 'No Big 6',
            predicate: (filterValues: any[], cellValue: any) => {
              return !bigSix.includes(cellValue);
            },
            numberOfInputs: 0,
          })
        }
      })

      colDefs.find((def) => {
        if (def.field === 'topicCodes') {
          def.tooltipValueGetter = (p: ITooltipParams) => p.value;
          def.headerTooltip = "Topic Codes";
          def.tooltipShowDelay = 0;
          def.cellStyle = {'word-break': 'break-word'}
        }
      })

      colDefs.find((def) => {
        if (def.field === "attendedMeetingIds") {
          def.tooltipValueGetter = (p: ITooltipParams) => p.value;
          def.headerTooltip = "Meeting Ids";
          def.tooltipShowDelay = 0;
          def.cellStyle = {'word-break': 'break-word'}
        }
      })
    }
  }, [isRefetching])

  const onBtnExport = useCallback(() => {
    gridRef.current!.api.exportDataAsCsv({
      exportedRows: 'filteredAndSorted',
      columnKeys: [
        "id",
        "firstName",
        "lastName",
        "preferredAddress",
        "company",
        "macpa_preferredAddressLine1",
        "macpa_preferredAddressLine2",
        "macpa_preferredAddressLine3",
        "macpa_preferredAddressLine4",
        "macpa_preferredCity",
        "macpa_preferredState",
        "macpa_preferredZip",
        "macpa_badgeName",
        "memberType",
        "email",
      ]
    });
  }, []);

  // TODO refer to the feature request milestone: https://docs.google.com/document/d/1-hETY_hsz0nTJnsPSsNWFYwxilChaO0yUXjWmiDUSJA/edit
  useEffect(() => {
    setPieData(_(rowData)
      .map(row => ({
        generation: isWhat(row)
      }))
      .groupBy(row => row.generation)
      .map((value, key) => {
        return {
          generation: key,
          amount: value.length,
        }
      })
      .value())
  }, [data.rowData])

  return (
    <>
      <Spin spinning={loading} fullscreen />
      <Space direction="vertical" className='w-full'>
        <Space direction="vertical" className='w-full'>
          <Typography.Title level={2}>MICPA Query Builder</Typography.Title>
          <Space direction="vertical" className='w-full bg-[#FAFAFA] p-6 border border-[#EFEFEF]'>
            <Space direction="vertical" className='w-full'>
              <Typography.Title level={5}>Select credited period (recommended to speed up query)</Typography.Title>
              <RangePicker value={dates} onChange={(dates) => setDates(dates)} picker="month" />
            </Space>
            <Typography.Title level={5}>Enter Keywords</Typography.Title>
            <TextArea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value || '')}
              rows={4}
              placeholder="Type/Paste comma separate keywords. e.g. Corporate Finance,Leadership,Short-Term Rental"
            />
            <div>
              <span className='text-[#B3B3B3] text-xs mr-6'>Preview parsed result:</span>
              {keywords.split(',').map((keyword) => {
                return (
                  keyword && <Tag>{keyword}</Tag>
                )
              })}
            </div>
            <Space direction="vertical" className='w-full'>
              <Typography.Title level={5}>Source</Typography.Title>
              <Segmented options={options} value={value} onChange={setValue} />
            </Space>
            <Typography.Title level={5}></Typography.Title>
            <Button type="primary" icon={<SearchOutlined />} onClick={search}>
              Search
            </Button>
          </Space>
        </Space>
      </Space>
      <div style={{ margin: "10px 0" }} className="flex justify-end">
        <Button onClick={onBtnExport}>Download filtered and sorted result as CSV</Button>
      </div>
      <div style={{ width: "1000px", height: "600px", margin: "10px 0" }} className="flex justify-begin">
        <PieChart total={rowData.length} data={pieData} title="Age generation chart" angleKey="amount" legendItemKey='generation' />
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
          columnMenu='new'
          defaultColDef={defaultColDef}
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
