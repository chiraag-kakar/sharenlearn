from django.contrib.sitemaps import Sitemap
from django.urls import reverse

class StaticViewSitemap(Sitemap):
    priority = 0.5
    changefreq = 'weekly'

    def items(self):
        return ['index', 'about','contact','login','profile','view_users','accepted_notes',"all_notes","admin_home",'rejected_notes','viewall_usernotes','view_usernotes',]

    def location(self, item):
        return reverse(item)