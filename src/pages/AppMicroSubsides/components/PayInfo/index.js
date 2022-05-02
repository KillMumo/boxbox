import React from 'react'
import D from '@/components/DescriptionList'
import { formatMoney } from '@/utils'
import DownloadItem from '@/components/DownloadItem'

const { Description: I } = D

const PostLoanInfo = ({ data }) => {
  return (
    <D>
      <I label="放款账号">{data.loanBankAccount}</I>
      <I label="开户省市">
        {data.loanBankProvince} {data.loanBankCity}
      </I>
      <I label="开户银行">{data.loanBankSiteName}</I>
      <I label="所属支行">{data.loanBankBranch}</I>
      <I label="放款金额(元)">{formatMoney(data.loanPayAmount)}</I>
      <I label="放款银行">{data.loanPayBankName}</I>
      <I label="放款时间">{data.loanPayDate}</I>
      <I label="约定还款日">{data.loanAppointDate}</I>
      <I label="银行流水号" whole>
        {data.loanBankStream}
      </I>
      <I label="银行放款材料" whole>
        <DownloadItem list={data.loanFiles || []} />
      </I>
      <I label="操作人">{data.loanOpUserName}</I>
      <I label="操作时间">{data.loanCreateTime}</I>
      <I label="备注" whole>
        {data.loanRemark}
      </I>
    </D>
  )
}

export default PostLoanInfo
