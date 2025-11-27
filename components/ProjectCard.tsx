interface ProjectCardProps {
  title: string
  description: string
  image?: string
  link?: string
  tags?: string[]
  category?: 'data-engineering' | 'data-analysis' | 'visualization'
}

export default function ProjectCard({ title, description, image, link, tags, category }: ProjectCardProps) {
  return (
    <div className="card group cursor-pointer hover-lift">
      {image && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <div className="aspect-video bg-slate-700 group-hover:scale-105 transition-transform duration-300">
            {/* Placeholder for image - you can add actual images later */}
            <div className="w-full h-full flex items-center justify-center text-slate-muted">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xl font-semibold text-slate-light group-hover:text-mint transition-colors">
          {title}
        </h3>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-mint hover:text-mint/80 transition-all ml-2 transform hover:scale-110"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
      <p className="text-slate-muted mb-4">{description}</p>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium bg-navy border border-mint/30 text-mint rounded-full hover:border-mint hover:bg-mint/10 transition-all"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

