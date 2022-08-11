from django.contrib import admin

from VocAsk.accounts.models import VocabularySets

# Register your models here.
class VocabularySetsAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "vocEn",
        "vocDe",
        "user",
    )


admin.site.register(VocabularySets, VocabularySetsAdmin)
