import {Component, inject} from "@angular/core";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {AppDataService} from "@app/app-data.service";
import {TranslatorPipe} from "@app/shared/pipes/translate";
import {CryptoService} from "@app/shared/services/crypto.service";
import {PreferenceResolver} from "@app/shared/resolvers/preference.resolver";


@Component({
    selector: "src-confirmation-with-password",
    templateUrl: "./confirmation-with-password.component.html",
    standalone: true,
    imports: [FormsModule, TranslateModule, TranslatorPipe]
})
export class ConfirmationWithPasswordComponent {
  private activeModal = inject(NgbActiveModal);
  private cryptoService = inject(CryptoService);
  private preferencesService = inject(PreferenceResolver);
  private appDataService = inject(AppDataService);

  secret: string;

  confirmFunction: (secret: string) => void;

  dismiss() {
    this.activeModal.dismiss();
  }

  async confirm() {
    let secret = this.secret;

    if (this.preferencesService.dataModel.salt) {
      this.appDataService.updateShowLoadingPanel(true);
      secret = await this.cryptoService.hashArgon2(secret, this.preferencesService.dataModel.salt);
      this.appDataService.updateShowLoadingPanel(false);
    }

    this.confirmFunction(secret);

    return this.activeModal.close(secret);
  }
}
