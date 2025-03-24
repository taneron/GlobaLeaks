import {Component, OnInit, inject} from "@angular/core";
import {AppDataService} from "@app/app-data.service";
import {preferenceResolverModel} from "@app/models/resolvers/preference-resolver-model";
import {PreferenceResolver} from "@app/shared/resolvers/preference.resolver";
import {UtilsService} from "@app/shared/services/utils.service";

import {MarkdownComponent} from "ngx-markdown";
import {StripHtmlPipe} from "@app/shared/pipes/strip-html.pipe";


@Component({
    selector: "src-recipient-home",
    templateUrl: "./home.component.html",
    standalone: true,
    imports: [MarkdownComponent, StripHtmlPipe]
})
export class HomeComponent implements OnInit {
  protected appDataService = inject(AppDataService);
  private utilsService = inject(UtilsService);
  private preference = inject(PreferenceResolver);
  currentYear = new Date().getFullYear();

  preferenceData: preferenceResolverModel;

 ngOnInit(): void {
    if (this.preference.dataModel) {
       this.preferenceData = this.preference.dataModel;
     }
    // if (this.appDataService.public.node.user_privacy_policy_text && this.preferenceData.accepted_privacy_policy === "1970-01-01T00:00:00Z") {
    //  this.utilsService.acceptPrivacyPolicyDialog().subscribe();
    // }
  }
}
