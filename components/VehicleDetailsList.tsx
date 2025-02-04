'use client'

import { Vehicle } from '@/dto'
import React, { useRef, useState } from 'react'
import { Separator } from './ui/separator'
import { convertTimestampToDate } from '@/utils'
import { Button } from './ui/button'
import { useFileUpload } from '@/hooks/use-file-upload'
import { Input } from './ui/input'
import { Upload } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const VehicleDetailsList = ({ vehicle }: { vehicle: Vehicle }) => {
  const uploadFile = useFileUpload();
  const { toast } = useToast()

  const downloadFile = async (filename: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL_PROD}/generate-download-url?file_name=${filename}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch the signed URL');
      }
      const { download_url } = await response.json();

      console.log(response, download_url)
      if (typeof window !== 'undefined') {
        window.open(download_url, '_blank');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (type === 'rc') {
      if (!e.target.files || !e.target.files[0]) {
        toast({
          title: 'Failed to upload file',
          description: 'Please try again later.',
          variant: 'destructive'
        })
        return;
      }
      uploadFile(`${vehicle.rc_url}`, e.target.files[0])
        .then(() => {
          toast({
            title: 'RC uploaded successfully!'
          })
        })
        .catch((err) => {
          toast({
            title: 'Failed to upload RC',
            variant: 'destructive'
          })
          return;
        })
    }

    if (type === 'insurance') {
      if (!e.target.files || !e.target.files[0]) {
        toast({
          title: 'Failed to upload file',
          description: 'Please try again later.',
          variant: 'destructive'
        })
        return;
      }
      uploadFile(`${vehicle.insurance_url}`, e.target.files[0])
        .then(() => {
          toast({
            title: 'Insurance uploaded successfully!'
          })
        })
        .catch((err) => {
          toast({
            title: 'Failed to upload Insurance',
            variant: 'destructive'
          })
          return;
        })
    }

    if (type === 'fitness') {
      if (!e.target.files || !e.target.files[0]) {
        toast({
          title: 'Failed to upload file',
          description: 'Please try again later.',
          variant: 'destructive'
        })
        return;
      }
      uploadFile(`${vehicle.fitness_url}`, e.target.files[0])
        .then(() => {
          toast({
            title: 'Fitness uploaded successfully!'
          })
        })
        .catch((err) => {
          toast({
            title: 'Failed to upload Fitness',
            variant: 'destructive'
          })
          return;
        })
    }

    if (type === 'puc') {
      if (!e.target.files || !e.target.files[0]) {
        toast({
          title: 'Failed to upload file',
          description: 'Please try again later.',
          variant: 'destructive'
        })
        return;
      }
      uploadFile(`${vehicle.rc_url}`, e.target.files[0])
        .then(() => {
          toast({
            title: 'PUC uploaded successfully!'
          })
        })
        .catch((err) => {
          toast({
            title: 'Failed to upload PUC',
            variant: 'destructive'
          })
          return;
        })
    }
  }

  return (
    <div className="flex w-full px-16 flex-col justify-center space-y-2 rounded-xl bg-white py-8">
      <div className="grid grid-cols-2 gap-4">
        <div>Asset Number</div>
        <div className="text-lg font-semibold">{vehicle.asset_no}</div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Region</div>
        <div className="text-lg font-semibold">{vehicle.region}</div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>State</div>
        <div className="text-lg font-semibold">{vehicle.state}</div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>City</div>
        <div className="text-lg font-semibold">{vehicle.city}</div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Registration Number</div>
        <div className="text-lg font-semibold">{vehicle.registration_no}</div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Make</div>
        <div className="text-lg font-semibold">{vehicle.make}</div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Model</div>
        <div className="text-lg font-semibold">{vehicle.model}</div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Variant</div>
        <div className="text-lg font-semibold">{vehicle.variant}</div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Tranmission Type</div>
        <div className="text-lg font-semibold">
          {vehicle.transmission_type}
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Fuel Type</div>
        <div className="text-lg font-semibold">{vehicle.fuel_type}</div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Seating Capacity</div>
        <div className="text-lg font-semibold">{vehicle.capacity}</div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Color</div>
        <div className="text-lg font-semibold">{vehicle.color}</div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>KM Run</div>
        <div className="text-lg font-semibold">{vehicle.km_run}</div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Chassis Number</div>
        <div className="text-lg font-semibold">{vehicle.chassis_no}</div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Engine Number</div>
        <div className="text-lg font-semibold">{vehicle.engine_no}</div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Date of Manufacture</div>
        <div className="text-lg font-semibold">
          {convertTimestampToDate(vehicle.manufacturing_date)}
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Date of Registration</div>
        <div className="text-lg font-semibold">
          {convertTimestampToDate(vehicle.registration_date)}
        </div>
      </div>
      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div>RC</div>
        <div className='flex justify-between'>
          <Button onClick={() => downloadFile(vehicle.rc_url)} variant='ghost' className="text-lg font-semibold">
            View
          </Button>
          <Button variant='ghost' className="text-lg font-semibold">
            <div className="flex items-center justify-between gap-2">
              <Input id='rc-upload' className="hidden" type="file" onChange={(e) => handleFileUpload(e, 'rc')} />
              <label htmlFor='rc-upload' className="rounded-md px-2 py-[5px] w-full flex items-center gap-4 cursor-pointer">
                <div className="w-full flex items-center justify-between gap-2">Replace <Upload /></div>
              </label>
            </div>
          </Button>
          {/* <Button onClick={() => downloadFile(vehicle.rc_url)} variant='ghost' className="text-lg font-semibold">
          Delete
        </Button> */}
        </div>
      </div>
      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div>Insurance Valid Upto</div>
        <div className="text-lg font-semibold">
          {convertTimestampToDate(vehicle.insurance_validity)}
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Insurance</div>
        <div className='flex justify-between'>
        <Button onClick={() => downloadFile(vehicle.insurance_url)} variant='ghost' className="text-lg font-semibold">
          View
        </Button>
        <Button variant='ghost' className="text-lg font-semibold">
          <div className="flex items-center justify-between gap-2">
            <Input id='insurance-upload' className="hidden" type="file" onChange={(e) => handleFileUpload(e, 'insurance')} />
            <label htmlFor='insurance-upload' className="rounded-md px-2 py-[5px] w-full flex items-center gap-4 cursor-pointer">
              <div className="w-full flex items-center justify-between gap-2">Replace <Upload /></div>
            </label>
          </div>
        </Button>
        </div>
        
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>PUC Valid Upto</div>
        <div className="text-lg font-semibold">
          {convertTimestampToDate(vehicle.puc_validity)}
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>PUC</div>
        <div className='flex justify-between'>
        <Button onClick={() => downloadFile(vehicle.puc_url)} variant='ghost' className="text-lg font-semibold">
          View
        </Button>
        <Button variant='ghost' className="text-lg font-semibold">
          <div className="flex items-center justify-between gap-2">
            <Input id='puc-upload' className="hidden" type="file" onChange={(e) => handleFileUpload(e, 'puc')} />
            <label htmlFor='puc-upload' className="rounded-md px-2 py-[5px] w-full flex items-center gap-4 cursor-pointer">
              <div className="w-full flex items-center justify-between gap-2">Replace <Upload /></div>
            </label>
          </div>
        </Button>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Fitness Valid Upto</div>
        <div className="text-lg font-semibold">
          {convertTimestampToDate(vehicle.fitness_validity)}
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Fitness</div>
        <div className='flex justify-between'>
        <Button onClick={() => downloadFile(vehicle.fitness_url)} variant='ghost' className="text-lg font-semibold">
          View
        </Button>
        <Button variant='ghost' className="text-lg font-semibold">
          <div className="flex items-center justify-between gap-2">
            <Input id='fitness-upload' className="hidden w-full" type="file" onChange={(e) => handleFileUpload(e, 'fitness')} />
            <label htmlFor='fitness-upload' className="rounded-md px-2 py-[5px] w-full flex items-center gap-4 cursor-pointer">
              <div className="w-full flex items-center justify-between gap-2">Replace <Upload /></div>
            </label>
          </div>
        </Button>
        </div>
      </div>
      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div>Last Battery Change Date</div>
        <div className="text-lg font-semibold">
          {convertTimestampToDate(vehicle.last_battery_change)}
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Last Service Date</div>
        <div className="text-lg font-semibold">
          {convertTimestampToDate(vehicle.last_service)}
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Last Service KMs</div>
        <div className="text-lg font-semibold">
          {vehicle.last_service_kms}
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Next Service Due Date</div>
        <div className="text-lg font-semibold">
          {convertTimestampToDate(vehicle.next_service_due)}
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Next Service KMs</div>
        <div className="text-lg font-semibold">
          {vehicle.next_service_due_kms}
        </div>
      </div>
      <Separator />






      <div className="grid grid-cols-2 gap-4">
        <div>Vehicle Entry Date</div>
        <div className="text-lg font-semibold">
          {convertTimestampToDate(vehicle.created_at)}
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div>Last Entry Updated at</div>
        <div className="text-lg font-semibold">
          {convertTimestampToDate(vehicle.updated_at)}
        </div>
      </div>
    </div>
  )
}

export default VehicleDetailsList