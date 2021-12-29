from django.contrib import admin

from . import models

# Register your models here.
admin.site.register(models.Tweet)
admin.site.register(models.Media)
admin.site.register(models.Like)
admin.site.register(models.Retweet)
admin.site.register(models.QuoteTweet)
