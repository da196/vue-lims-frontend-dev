import {
  AlignmentType,
  Document,
  Table,
  TableCell,
  WidthType,
  TableRow,
  Header,
  PageBreak,
  HeadingLevel,
  Paragraph,
  PageOrientation,
  SectionType } from 'docx'

export class DocumentCreator {
    filterType = 'licence'
    createlicence(allLicenses, activeLicences, expiredLicenses, cancelledLicenses, suspendedLicenses, filterType = 'licence') {
      this.filterType = filterType
      let currentDate = new Date()
      currentDate = currentDate.toLocaleString()
      const headerData = this.filterData(allLicenses)
      const document = new Document({
        sections: [{
          properties: {
            type: SectionType.CONTINUOUS,
            page: {
              size: {
                orientation: PageOrientation.LANDSCAPE

              }
            }
          },
          headers: {
            default: this.createHeader()
          },
          children: [
            new Paragraph({
              text: 'Licencing Information Management System',
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 200,
                before: 600
              }
            }),
            new Paragraph({
              text: `Application and licensing report as of ${currentDate}`,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.LEFT,
              spacing: {
                before: 600
              },
              children: [new PageBreak()]
            }),
            this.createHeading('All Licences'),
            this.createTable(allLicenses, Object.keys(headerData[0])),
            this.createHeading('Active Licences'),
            this.createTable(activeLicences, Object.keys(headerData[0])),
            this.createHeading('Expired Licences'),
            this.createTable(expiredLicenses, Object.keys(headerData[0])),
            this.createHeading('Cancelled Licences'),
            this.createTable(cancelledLicenses, Object.keys(headerData[0])),
            this.createHeading('Suspended Licences'),
            this.createTable(suspendedLicenses, Object.keys(headerData[0]))
          ]

        }]
      })

      return document
    }

    createApplication(allApplications, newApplications, inProgressApplications, atMinistryApplications, cancelledApplications, filterType = 'application') {
      this.filterType = filterType
      let currentDate = new Date()
      currentDate = currentDate.toLocaleString()
      const headerData = this.filterData(allApplications)
      const document = new Document({
        sections: [{
          properties: {
            type: SectionType.CONTINUOUS,
            page: {
              size: {
                orientation: PageOrientation.LANDSCAPE

              }
            }
          },
          headers: {
            default: this.createHeader()
          },
          children: [
            new Paragraph({
              text: 'Licencing Information Management System',
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 200,
                before: 600
              }
            }),
            new Paragraph({
              text: `Application and licensing report as of ${currentDate}`,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.LEFT,
              spacing: {
                before: 600
              },
              children: [new PageBreak()]
            }),
            this.createHeading('All Applications'),
            this.createTable(allApplications, Object.keys(headerData[0])),
            this.createHeading('New Applications'),
            this.createTable(newApplications, Object.keys(headerData[0])),
            this.createHeading('Applications In-Progress'),
            this.createTable(inProgressApplications, Object.keys(headerData[0])),
            this.createHeading('Cancelled Applications'),
            this.createTable(cancelledApplications, Object.keys(headerData[0])),
            this.createHeading('Applications under Ministry review'),
            this.createTable(atMinistryApplications, Object.keys(headerData[0]))
          ]

        }]
      })

      return document
    }

    createHeader() {
      let currentDate = new Date()
      currentDate = currentDate.toLocaleString()
      return new Header({
        children: [new Paragraph(`TCRA-LIMS  Report generated on ${currentDate}`)]
      })
    }
    createHeading(text) {
      return new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_1,
        spacing: {
          after: 200
        }
      })
    }
    filterData(data) {
      console.log(this.filterType)
      const a = []
      if (this.filterType === 'licence') {
        for (let i = 0; i < data.length; i++) {
          const tmp = {
            'ID': `${i + 1}`,
            'Entity Name': data[i].applicantEntityName,
            'Product': data[i].licenseProduct,
            'Licence Number': data[i].licenceNumber,
            'Duration (Yrs)': `${data[i].duration} Yrs`,
            'License Processing Days': `${data[i].licenceProcessDays} Days`,
            'Application Date': data[i].applicationDate ? data[i].applicationDate.split('T')[0] : '',

            'Date Issued': data[i].issuedDate,
            'Expiry Date': data[i].expireDate,
            'Licence State': data[i].licenceState

          }
          a.push(tmp)
        }
        return a
      } else {
        for (let i = 0; i < data.length; i++) {
          const tmp = {
            'ID': `${i + 1}`,
            'Entity Name': data[i].applicantEntityName,
            'Product': data[i].licenseProduct,
            'Application Number': data[i].applicationNumber,
            'Duration (Yrs)': `${data[i].duration} Yrs`,
            'License Processing Days': `${data[i].licenceProcessDays} Days`,
            'Application Date': data[i].applicationDate ? data[i].applicationDate.split('T')[0] : '',
            'Licence State': data[i].licenceState,
            'Application Type': data[i].applicationType,
            'Application Stage': data[i].applicationStage
          }
          a.push(tmp)
        }
        return a
      }
    }
    createTable(tableData, tableHeaders) {
      if (tableData.length < 1) {
        const rowList = []
        rowList.push(this.createTableRow(tableHeaders, true))
        rowList.push(
          new TableRow({
            children: [
              new TableCell({ children: [
                new Paragraph({
                  text: 'N/A',
                  heading: HeadingLevel.HEADING_2,
                  alignment: AlignmentType.CENTER
                })
              ],
              columnSpan: 10
              })
            ]
          })
        )
        return new Table({
          rows: rowList,
          spacing: {
            after: 600
          },
          width: {
            size: 100,
            type: WidthType.PERCENTAGE
          }
        })
      }
      const rowList = []
      tableData = this.filterData(tableData)
      // tableHeaders = this.filterData(tableHeaders)
      rowList.push(this.createTableRow(tableHeaders, true))
      for (let i = 0; i < tableData.length; i++) {
        rowList.push(this.createTableRow(tableData[i]))
      }

      return new Table({
        rows: rowList,
        spacing: {
          after: 600
        },
        width: {
          size: 100,
          type: WidthType.PERCENTAGE
        }
      })
    }
    createTableRow(data, header = false) {
      // convert data object to list so as to easily enter the table
      data = Object.values(data)
      // init an array of children cells that will be injected with data
      const childrenCells = []
      for (const dataKey in data) {
        childrenCells.push(this.createTableCell(data[dataKey]))
      }
      return new TableRow({
        tableHeader: header,
        children: childrenCells
      })
    }
    createTableCell(cellData) {
      return new TableCell({
        children: [new Paragraph(cellData || '')]
      })
    }
}
