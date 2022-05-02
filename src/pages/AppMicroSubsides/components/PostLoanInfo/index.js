import React from 'react'
import D from '@/components/DescriptionList'
import DownloadItem from '@/components/DownloadItem'
import PostLoanInfoTable from '../PostLoanInfoTable'
import Wrap from '../Wrap'

const { Description: I } = D
// isCompany:是否为企业角色的贷后报告
const PostLoanInfo = ({ data, list, isCompany }) => {
  return (
    <React.Fragment>
      {data && (
        <D title="还款信息">
          <I label="还款账号">{data.payPayBackAccount}</I>
          <I label="开户银行">{data.payPayBackBank}</I>
          <I label="开户省市">
            {data.payPayBackProvince} {data.payPayBackCity}
          </I>
          <I label="开户支行">{data.payPayBackBankBranch}</I>
          <I label="还款本金(元)">{data.payPayBackNum}</I>
          <I label="银行流水号">{data.payBankStream}</I>
          <I label="实际还款日" whole>
            {data.payActualPayBackDate}
          </I>
          <I label="还款材料" whole>
            <DownloadItem list={data.payFiles || []} />
          </I>
          <I label="操作人">{data.payOpUserName}</I>
          <I label="操作时间">{data.payCreateTime}</I>
          <I label="备注" whole>
            {data.payRemark}
          </I>
        </D>
      )}
      {/* {list &&
        list.map((i, d) => {
          const { extra } = i
          return (
            <D key={i.id} title={d === 0 ? '保后报告' : ''}>
              <I label="保后报告" whole>
                <DownloadItem list={extra.postLoanFiles || []} />
              </I>
              <I label="其余材料" whole>
                <DownloadItem list={extra.extraFiles || []} />
              </I>
              <I label="操作人">{extra.opUserName}</I>
              <I label="操作时间">{extra.createTime}</I>
              <I label="备注" whole>
                {extra.remark}
              </I>
            </D>
          )
        })} */}
      {list && !isCompany && (
        <Wrap title="保后报告">
          <PostLoanInfoTable data={list.map((i) => i.extra)} />
        </Wrap>
      )}
    </React.Fragment>
  )
}

export default PostLoanInfo
