import React, { useEffect } from 'react';
import Card from '@/components/Card';
import D from '@/components/DescriptionList';
import { getshuju } from '@/services/box';
import { Form } from 'antd';
import DownloadItem from '@/components/DownloadItem'

const { Description: I } = D;

const Page = (props) => {

  return (
      <Card transparent>
        <Card title="供应商基本信息" style={{ marginBottom: '16px' }}>
          <D>
            <I label="供应商名称">{getshuju().companyname}</I>
            <I label="供应商地址">{getshuju().address}</I>
            <I label="联系人姓名">{getshuju().name}</I>
            <I label="联系人电话">{getshuju().number}</I>
          </D>
        </Card>
        <Card title="模切版基本信息">
          <D>
            <I label="成品盒长(mm)">{getshuju().finallength}</I>
            <I label="成品盒宽(mm)">{getshuju().finalwidth}</I>
            <I label="成品盒高(mm)">{getshuju().finalheight}</I>
            <I label="盒型种类">{getshuju().type}</I>
            <I label="最新编辑日期">{getshuju().checktime}</I>
            <I label="数字文件" whole>
              <DownloadItem list={getshuju().boxfile || []} />
            </I>
          </D>
        </Card>
      </Card>
  );
};

export default Page;
