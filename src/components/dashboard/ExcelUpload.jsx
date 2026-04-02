import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useData } from '@/context/DataContext'
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, X, Loader2 } from 'lucide-react'

export function ExcelUpload() {
  const { parseExcelFile, uploadStatus, clearUploadStatus, uploadHistory } = useData()
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
    // Reset input so same file can be uploaded again
    e.target.value = ''
  }

  const handleFile = async (file) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ]
    const ext = file.name.split('.').pop().toLowerCase()
    if (!validTypes.includes(file.type) && !['xlsx', 'xls', 'csv'].includes(ext)) {
      alert('Please upload an Excel file (.xlsx, .xls) or CSV file.')
      return
    }

    try {
      await parseExcelFile(file)
    } catch (err) {
      console.error('Upload error:', err)
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          Import Data
        </CardTitle>
        <CardDescription>
          Upload Excel (.xlsx, .xls) or CSV files to import donations, expenses, or fund data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drop Zone */}
        <div
          className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 cursor-pointer ${
            dragActive
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-border hover:border-primary/50 hover:bg-muted/30'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileInput}
            className="hidden"
            id="excel-upload-input"
          />
          
          <div className="flex flex-col items-center gap-3">
            {uploadStatus.loading ? (
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            ) : (
              <div className={`rounded-full p-4 transition-colors ${dragActive ? 'bg-primary/10' : 'bg-muted'}`}>
                <Upload className={`h-8 w-8 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium">
                {uploadStatus.loading 
                  ? 'Processing file...' 
                  : dragActive 
                    ? 'Drop your file here' 
                    : 'Drag & drop your Excel file here'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or <span className="text-primary font-medium hover:underline">browse</span> to choose a file
              </p>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Supports .xlsx, .xls, and .csv files
            </p>
          </div>
        </div>

        {/* Status Messages */}
        {uploadStatus.success && (
          <div className="flex items-start gap-3 rounded-lg bg-emerald-50 p-4 animate-in">
            <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-800">Upload Successful</p>
              <p className="text-xs text-emerald-600 mt-0.5">{uploadStatus.success}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); clearUploadStatus() }}
              className="text-emerald-400 hover:text-emerald-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {uploadStatus.error && (
          <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 animate-in">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Upload Failed</p>
              <p className="text-xs text-red-600 mt-0.5">{uploadStatus.error}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); clearUploadStatus() }}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Upload History */}
        {uploadHistory.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Recent Uploads
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {uploadHistory.map((upload) => (
                <div key={upload.id} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 text-sm">
                  <FileSpreadsheet className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{upload.fileName}</p>
                    <p className="text-xs text-muted-foreground">{upload.details}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(upload.date).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
