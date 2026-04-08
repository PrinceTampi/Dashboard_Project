import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export const exportDashboardToPDF = async (fileName = 'Sleep_Health_Report.pdf') => {
  try {
    // Find the dashboard element
    const dashboardElement = document.querySelector('.dashboard')
    
    if (!dashboardElement) {
      console.error('Dashboard element not found')
      return
    }

    // Show a temporary loading message
    const loadingDiv = document.createElement('div')
    loadingDiv.innerHTML = 'Generating PDF...'
    loadingDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 20px 40px;
      border-radius: 8px;
      z-index: 9999;
      font-size: 18px;
    `
    document.body.appendChild(loadingDiv)

    // Convert dashboard to canvas
    const canvas = await html2canvas(dashboardElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false
    })

    // Calculate dimensions for PDF
    const imgData = canvas.toDataURL('image/png')
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    let imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    let position = 0

    // Add pages
    while (heightLeft >= 0) {
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      if (heightLeft > 0) {
        pdf.addPage()
        position = heightLeft - imgHeight
      }
    }

    // Save the PDF
    pdf.save(fileName)

    // Remove loading message
    document.body.removeChild(loadingDiv)
    
    console.log(`PDF exported successfully as ${fileName}`)
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    alert('Error exporting PDF. Please try again.')
  }
}
