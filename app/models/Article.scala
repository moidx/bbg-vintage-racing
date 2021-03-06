/**
  * Copyright (C) 2015-2016 Miguel Osorio. All rights reserved.
  */
package models

import java.util.UUID
import org.joda.time.DateTime
import play.api.libs.json.Json


/**
  * The article object.
  *
  * @param id: The unique ID for the article.
  * @param userId: The author's user ID.
  * @param language: The document's language.
  * @param title: The article's title.
  * @param content: The body of the article.
  * @param creationDate: The date in which the article was created in the database.
  * @param updateDate: The date in which the article was last updated in the database.
  * @param active: Flag to enable/disable article.
  */
case class Article (id: Option[UUID],
                    userId: UUID,
                    language: String,
                    title: Option[String],
                    content: Option[String],
                    creationDate: Option[DateTime],
                    updateDate: Option[DateTime],
                    translations: Option[Seq[Translation]] = None,
                    active: Boolean) {
}

object Article {
  /**
    * Converts the [Article] object to Json and vice versa.
    */
  implicit val jsonFormat = Json.format[Article]

  val collectionName = "article"
}