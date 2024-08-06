'use client';

import { SquareArrowOutUpRight } from 'lucide-react';

export default function UploadListing({ url, clickHandler, index, coverIndex }: any) {
	return (
		<>
			<div
				key={url}
				className={`
						relative image-listing block py-3 pl-3 pr-10 mt-2 text-sm 
						bg-slate-100 truncate border-2 rounded-sm hover:cursor-pointer
						${index === coverIndex ? 'border-green-200' : 'border-slate-200'}
					`}
				onClick={() => clickHandler(index)}
			>
				<span key={url} className="">
					{url}
				</span>
				<a href={url} target="_blank" className="absolute right-3 top-3">
					<SquareArrowOutUpRight size="18" />
				</a>
			</div>
		</>
	);
}
