import React from 'react'
import Tag from './Tag'
import { Button } from './ui/button'

interface TopHeaderProps {
    tagTitle: string,
    title: string,
    buttonText: string,
    TagIcon?: any
    buttonDisable?: boolean
}

const TopHeader: React.FC<TopHeaderProps> = ({
    buttonText,
    tagTitle, title,
    TagIcon, buttonDisable = false
}) => {
    return (
        <div>
            <div className='flex items-center justify-between mt-2 p-2' >
                <div className='flex flex-col  gap-2'>
                    <div className='w-fit'>
                        <Tag title={tagTitle} />
                    </div>
                    <p className='text-3xl font-semibold'>
                        {title}
                    </p>
                </div>
                <div>
                    <Button variant={'ghost'} className='bg-[#FCC608]' disabled={buttonDisable }>
                        <p className='text-lg font-medium px-4' >
                            {buttonText}
                        </p>
                        {TagIcon}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default TopHeader
