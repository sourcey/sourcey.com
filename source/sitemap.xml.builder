#xml.instruct!
#xml.urlset 'xmlns' => "http://www.sitemaps.org/schemas/sitemap/0.9" do
#  sitemap.resources.select { |page| page.path =~ /\.html/ }.each do |page|
#    xml.url do
#      xml.loc "#{data.sitemap.url}#{page.path}"
#      xml.lastmod Date.today.to_time.iso8601
#      xml.changefreq page.data.changefreq || "daily"
#      xml.priority page.data.priority || "1"
#    end
#  end
#end

xml.instruct!
xml.urlset "xmlns" => "http://www.sitemaps.org/schemas/sitemap/0.9" do
  sitemap.resources.each do |resource|
    xml.url do
      xml.loc "#{data.site.url}#{resource.url}"
      xml.lastmod Date.today.to_time.iso8601
    end if resource.url !~ /\.(bower_components|css|js|eot|svg|woff|ttf|png|jpg)$/ 
  end
end