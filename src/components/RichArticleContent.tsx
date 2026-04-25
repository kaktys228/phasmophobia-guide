interface RichArticleContentProps {
  html: string;
}

export function RichArticleContent({ html }: RichArticleContentProps) {
  return (
    <div
      className={[
        'text-white/85 leading-relaxed',
        '[&_h2]:scroll-mt-28 [&_h2]:mt-10 [&_h2]:mb-5 [&_h2]:border-b [&_h2]:border-white/10 [&_h2]:pb-3 [&_h2]:text-[2.05rem] [&_h2]:font-semibold [&_h2]:text-white',
        '[&_h3]:scroll-mt-28 [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white/95',
        '[&_p]:mb-5 [&_p]:text-[16px] [&_p]:leading-8 [&_p]:text-white/82',
        '[&_ul]:mb-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-7',
        '[&_ol]:mb-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-7',
        '[&_li]:text-[16px] [&_li]:leading-8 [&_li]:text-white/82',
        '[&_blockquote]:my-6 [&_blockquote]:rounded-[24px] [&_blockquote]:border [&_blockquote]:border-white/10 [&_blockquote]:bg-white/[0.03] [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:text-white/72',
        '[&_hr]:my-8 [&_hr]:border-white/10',
        '[&_em]:text-white/90 [&_em]:italic',
        '[&_strong]:font-semibold [&_strong]:text-white',
        '[&_code]:rounded-md [&_code]:border [&_code]:border-white/12 [&_code]:bg-white/6 [&_code]:px-2 [&_code]:py-1 [&_code]:font-mono [&_code]:text-[0.92em] [&_code]:text-white/95',
        '[&_kbd]:rounded-md [&_kbd]:border [&_kbd]:border-white/15 [&_kbd]:bg-white/5 [&_kbd]:px-2 [&_kbd]:py-1 [&_kbd]:text-xs [&_kbd]:font-semibold [&_kbd]:text-white/90',
        '[&_a]:text-[#b9a3ff] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-white',
        '[&_h2>a]:pointer-events-none [&_h2>a]:text-inherit [&_h2>a]:no-underline',
        '[&_h3>a]:pointer-events-none [&_h3>a]:text-inherit [&_h3>a]:no-underline',
        '[&_table]:my-6 [&_table]:w-full [&_table]:table-auto [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-[22px] [&_table]:border [&_table]:border-white/10 [&_table]:bg-white/[0.02]',
        '[&_thead]:bg-white/[0.05]',
        '[&_tbody_tr:nth-child(even)]:bg-white/[0.015]',
        '[&_th]:border [&_th]:border-white/10 [&_th]:px-3 [&_th]:py-3 [&_th]:text-left [&_th]:align-top [&_th]:text-[12px] [&_th]:font-semibold [&_th]:leading-5 [&_th]:text-white/90',
        '[&_td]:border [&_td]:border-white/10 [&_td]:px-3 [&_td]:py-3 [&_td]:align-top [&_td]:text-[13px] [&_td]:leading-6 [&_td]:break-words [&_td]:text-white/80',
        '[&_img]:mx-auto [&_img]:rounded-xl [&_img]:border [&_img]:border-white/10 [&_img]:bg-black/20 [&_img]:shadow-lg',
      ].join(' ')}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
