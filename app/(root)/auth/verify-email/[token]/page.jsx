'use client'

import { Card, CardContent } from '@/components/ui/card'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import verifiedImg from '@/public/assets/images/verified.gif'
import unverifiedImg from '@/public/assets/images/verification-failed.gif'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { WEBSITE_HOME } from '@/routes/WebsiteRoute'
import { useParams } from 'next/navigation'

const EmailVerification = () => {
  const params = useParams()
  const token = Array.isArray(params?.token)
    ? params.token[0]
    : params?.token

  const [isVerified, setIsVerified] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const verify = async () => {
      try {
        setLoading(true)
        const { data } = await axios.post(
          '/api/auth/verify-email',
          { token }
        )
        setIsVerified(data.success)
      } catch (error) {
        console.error("Email verification error:", error)
        setIsVerified(false)
      } finally {
        setLoading(false)
      }
    }

    verify()
  }, [token])

  if (loading) {
    return (
      <p className="text-center my-10">
        Verifying your email...
      </p>
    )
  }

  return (
    <Card className="max-w-md mx-auto mt-10">
      <CardContent>
        {isVerified ? (
          <div className="text-center">
            <Image
              src={verifiedImg}
              alt="Email verified successfully"
              width={100}
              height={100}
            />
            <h1 className="text-2xl text-gray-500 my-5">
              Email verification successful!
            </h1>
            <Button asChild>
              <Link href={WEBSITE_HOME}>
                Continue Shopping
              </Link>
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <Image
              src={unverifiedImg}
              alt="Email verification failed"
              width={100}
              height={100}
            />
            <h1 className="text-2xl text-red-500 my-5">
              Email verification failed!
            </h1>
            <Button asChild>
              <Link href={WEBSITE_HOME}>
                Continue Shopping
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default EmailVerification
