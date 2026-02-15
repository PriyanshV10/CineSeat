package com.cineseat.movie;

import com.cineseat.show.Show;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

public class MovieSpecification {

  public static Specification<Movie> hasCityId(Long cityId) {
    return (root, query, criteriaBuilder) -> {
      if (cityId == null || query == null) return null;

      // Subquery to find movies with shows in the given city
      Subquery<Long> subquery = query.subquery(Long.class);
      Root<Show> showRoot = subquery.from(Show.class);

      // Join Show -> Screen -> Theater -> City
      subquery
          .select(showRoot.get("movie").get("id"))
          .where(
              criteriaBuilder.equal(
                  showRoot.get("screen").get("theater").get("city").get("id"), cityId));

      return root.get("id").in(subquery);
    };
  }

  public static Specification<Movie> hasLanguage(String language) {
    return (root, query, criteriaBuilder) -> {
      if (language == null || language.isEmpty()) return null;
      return criteriaBuilder.equal(root.get("language"), language);
    };
  }

  public static Specification<Movie> hasGenre(String genre) {
    return (root, query, criteriaBuilder) -> {
      if (genre == null || genre.isEmpty()) return null;
      return criteriaBuilder.equal(root.get("genre"), genre);
    };
  }

  public static Specification<Movie> hasStatus(Movie.Status status) {
    return (root, query, criteriaBuilder) -> {
      if (status == null) return null;
      return criteriaBuilder.equal(root.get("status"), status);
    };
  }
}
